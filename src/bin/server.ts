import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource, EntityManager } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import express from 'express';
import bodyParser from 'body-parser';
import { validate } from 'class-validator';

import { loadConfig, log } from '../lib';

import ScrapedVideoData, { Video } from '../video';
import { Channel, ScrapedChannelData } from '../channel';
import { Recommendation } from '../recommendation';
import { ScrapedRecommendationData } from '../scraper';

async function main() {
  const password = process.argv[2];

  if (typeof password !== 'string') {
    // eslint-disable-next-line no-console
    console.error('Usage: ts-node src/bin/server.ts <password>');
    process.exit(1);
  }

  const cfg = loadConfig(password);
  const pg = new PgClient({
    ...cfg.server.db,
    user: cfg.server.db.username,
  });

  await pg.connect();
  await migrate({ client: pg }, 'data/migrations');

  const ds = new DataSource({
    type: 'postgres',
    ...cfg.server.db,
    synchronize: false,
    entities: [Video, Channel, Recommendation],
    namingStrategy: new SnakeNamingStrategy(),
  });

  await ds.initialize();
  const videoRepo = ds.getRepository(Video);
  const channelRepo = ds.getRepository(Channel);
  const recommendationRepo = ds.getRepository(Recommendation);

  const saveVideo = async (video: ScrapedVideoData): Promise<Video> => {
    const channel = new Channel(video.channel);
    const channelErrors = await validate(channel);
    if (channelErrors.length > 0) {
      throw new Error(`Invalid channel: ${JSON.stringify(channelErrors)}`);
    }
    const savedChannel = await channelRepo.save(channel);

    const videoEntity = new Video(video);
    videoEntity.channelId = savedChannel.id;
    const videoErrors = await validate(videoEntity);
    if (videoErrors.length > 0) {
      throw new Error(`Invalid video: ${JSON.stringify(videoErrors)}`);
    }
    return videoRepo.save(videoEntity);
  };

  const getChannelId = async (
    transaction: EntityManager, channel: ScrapedChannelData,
  ): Promise<number> => {
    const channelEntity = await transaction.findOneBy(Channel, {
      url: channel.url,
    });

    if (channelEntity) {
      return channelEntity.id;
    }

    const newChannel = new Channel(channel);
    const newChannelErrors = await validate(newChannel);
    if (newChannelErrors.length > 0) {
      throw new Error(`Invalid channel: ${JSON.stringify(newChannelErrors)}`);
    }
    return (await transaction.save(newChannel)).id;
  };

  const saveVideoWithTransaction = async (
    transaction: EntityManager, video: ScrapedVideoData,
  ): Promise<Video> => {
    if (!video.channel) {
      throw new Error('Video must have a channel');
    }

    const channelId = await getChannelId(transaction, video.channel);

    const videoEntity = new Video(video);
    videoEntity.channelId = channelId;
    const videoErrors = await validate(videoEntity);
    if (videoErrors.length > 0) {
      throw new Error(`Invalid video: ${JSON.stringify(videoErrors)}`);
    }
    return transaction.save(videoEntity);
  };

  const app = express();

  app.use(bodyParser.json());
  app.use((req, res, next) => {
    if (req.headers['x-password'] !== password) {
      res.status(401).send('Unauthorized');
      return;
    }

    next();
  });

  let seedVideoSentAt = new Date(0);

  app.post('/video/get-url-to-crawl', async (req, res) => {
    const v = await videoRepo.query(`
      UPDATE video set latest_crawl_attempted_at = now()
      WHERE id = (SELECT min(id) FROM video WHERE now() - latest_crawl_attempted_at > '10 minutes'::interval OR latest_crawl_attempted_at IS NULL)
      RETURNING url
    `);

    console.log(v);

    if (v[1] === 0) {
      if (new Date().getTime() - seedVideoSentAt.getTime() > 1000 * 10) {
        seedVideoSentAt = new Date();
        res.send({ url: cfg.seed_video });
      } else {
        res.send({ url: null });
      }
    } else {
      res.send({ url: v[0][0].url });
    }
  });

  const asError = (e: unknown):Error => {
    if (e instanceof Error) {
      return e;
    }
    return new Error('Could not save recommendations.');
  };

  app.post('/recommendation', async (req, res) => {
    const data = req.body as ScrapedRecommendationData;

    try {
      await ds.manager.transaction(async (transaction: EntityManager) => {
        const from = await saveVideoWithTransaction(transaction, data.from);

        for (const [rank, video] of Object.entries(data.to)) {
          // eslint-disable-next-line no-await-in-loop
          const to = await saveVideoWithTransaction(transaction, video);

          const recommendation = new Recommendation();
          recommendation.fromId = from.id;
          recommendation.toId = to.id;
          recommendation.createdAt = new Date();
          recommendation.updatedAt = new Date();
          recommendation.rank = +rank;
          // eslint-disable-next-line no-await-in-loop
          await transaction.save(recommendation);
        }

        from.crawled = true;
        await transaction.save(from);
      });
    } catch (e) {
      log.error(e);
      res.status(500).send(asError(e).message);
      return;
    }

    res.send({ ok: true });
  });

  app.listen(
    // eslint-disable-next-line no-console
    cfg.server.port, () => console.log(`Listening on port ${cfg.server.port}`),
  );
}

main();

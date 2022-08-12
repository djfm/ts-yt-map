import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource, EntityManager } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { validate } from 'class-validator';
import express from 'express';
import bodyParser from 'body-parser';
import { Logger } from 'winston';

import ScrapedVideoData, { Video } from '../video';
import { Channel, ScrapedChannelData } from '../channel';
import { Recommendation } from '../recommendation';
import { ScrapedRecommendationData } from '../scraper';
import { ServerConfig } from '../lib';

export interface ServerHandle {
  close: () => Promise<void>,
}

export const startServer = async (cfg: ServerConfig, log: Logger): Promise<ServerHandle> => {
  let countingRecommendationsSince = Date.now();
  let recommendationsSaved = 0;

  const pg = new PgClient({
    ...cfg.db,
    user: cfg.db.username,
  });

  try {
    await pg.connect();
  } catch (e) {
    log.error('Failed to connect to database', { error: e });
    throw e;
  }

  try {
    await migrate({ client: pg }, 'data/migrations');
  } catch (e) {
    log.error('Failed to migrate database', { error: e });
    throw e;
  }

  const ds = new DataSource({
    type: 'postgres',
    ...cfg.db,
    synchronize: false,
    entities: [Video, Channel, Recommendation],
    namingStrategy: new SnakeNamingStrategy(),
  });

  await ds.initialize();
  const videoRepo = ds.getRepository(Video);

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

    const existingVideo = await transaction.findOneBy(Video, {
      url: video.url,
    });

    if (existingVideo) {
      return existingVideo;
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
    if (req.headers['x-password'] !== cfg.password) {
      res.status(401).send('Unauthorized');
      return;
    }

    next();
  });

  let seedVideoSentAt = new Date(0);

  app.post('/video/get-url-to-crawl', async (req, res) => {
    const v = await videoRepo.query(`
      UPDATE video set latest_crawl_attempted_at = now(), crawl_attempt_count = crawl_attempt_count + 1
      WHERE id = (SELECT min(id) FROM video WHERE (now() - latest_crawl_attempted_at > '10 minutes'::interval OR latest_crawl_attempted_at IS NULL) AND crawl_attempt_count < 3 AND crawled = false)
      RETURNING url
    `);

    if (v[1] === 0) {
      if (new Date().getTime() - seedVideoSentAt.getTime() > 1000000 * 10) {
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

        recommendationsSaved += data.to.length;
        const elapsed = (Date.now() - countingRecommendationsSince) / 1000 / 60;

        if (elapsed > 0) {
          const recommendationsPerMinute = Math.round(recommendationsSaved / elapsed);
          log.info(`Saved recommendations per minute ${recommendationsPerMinute}`);

          // resetting the average every 10 minutes
          if (elapsed > 10) {
            countingRecommendationsSince = Date.now();
          }
        }
      });
    } catch (e) {
      log.error(e);
      res.status(500).send(asError(e).message);
      return;
    }

    res.send({ ok: true });
  });

  const server = app.listen(
    // eslint-disable-next-line no-console
    cfg.port, () => console.log(`Listening on port ${cfg.port}`),
  );

  return {
    close: async () => {
      await new Promise((resolve, reject) => {
        server.close(
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(null);
            }
          },
        );
      });

      await pg.end();
    },
  };
};

export default startServer;

import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource, EntityManager, Repository, LessThan } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { validate } from 'class-validator';
import express from 'express';
import bodyParser from 'body-parser';

import ScrapedVideoData, { Video } from '../video';
import { Channel, ScrapedChannelData } from '../channel';
import { Recommendation } from '../recommendation';
import { ScrapedRecommendation } from '../scraper';
import { ServerConfig, LoggerInterface } from '../lib';

export interface ServerHandle {
  close: () => Promise<void>,
  pg: PgClient,
}

const asError = (e: unknown):Error => {
  if (e instanceof Error) {
    return e;
  }
  return new Error('Unknown error');
};

let seedVideoSentAt = new Date(0);

let countingRecommendationsSince = Date.now();
let recommendationsSaved = 0;

export const startServer = async (
  cfg: ServerConfig, log: LoggerInterface,
): Promise<ServerHandle> => {
  const pg = new PgClient({
    host: cfg.db.host,
    port: cfg.db.port,
    user: cfg.db.username,
    password: cfg.db.password,
    database: cfg.db.database,
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
  const channelRepo = ds.getRepository(Channel);

  let countingVideosAskedSince = Date.now();

  type URLResp = { ok: true, url: string } | { ok: false };

  const getVideoToCrawl = async (): Promise<URLResp> => {
    if (Date.now() - countingVideosAskedSince > 1000 * 10 * 60) {
      countingVideosAskedSince = Date.now();
    }

    const v = await ds.transaction(async (tm): Promise<URLResp> => {
      const url = await tm.findOneBy(Video, {
        crawled: false,
        crawlAttemptCount: LessThan(3),
        latestCrawlAttemptedAt: LessThan(new Date()),
      });

      if (!url) {
        if (new Date().getTime() - seedVideoSentAt.getTime() > 1000000 * 10 * 60) {
          seedVideoSentAt = new Date();
          return { ok: true, url: cfg.seed_video };
        }

        return { ok: false };
      }

      return { ok: false };
    });

    return v;
  };

  const saveChannelAndGetId = async (
    repo: Repository<Channel>, channel: ScrapedChannelData,
  ): Promise<number> => {
    const currentChannel = await repo.findOneBy({
      youtubeId: channel.youtubeId,
    });

    if (currentChannel) {
      return currentChannel.id;
    }

    const newChannel = new Channel(channel);
    const newChannelErrors = await validate(newChannel);
    if (newChannelErrors.length > 0) {
      const msg = newChannelErrors.map((e) => e.constraints).join(', ');
      log.error(`Failed to save channel: ${msg}`, { newChannelErrors });
      throw new Error(msg);
    }
    const savedChannel = await repo.save(newChannel);
    return savedChannel.id;
  };

  const saveVideo = async (
    repo: Repository<Video>, channelRepo: Repository<Channel>, video: ScrapedVideoData,
  ): Promise<Video> => {
    if (!video.channel) {
      throw new Error('Video must have a channel');
    }

    const channelId = await saveChannelAndGetId(channelRepo, video.channel);

    const videoEntity = new Video(video);
    videoEntity.channelId = channelId;
    const videoErrors = await validate(videoEntity);
    if (videoErrors.length > 0) {
      const msg = `Invalid video: ${JSON.stringify(videoErrors)}`;
      log.error(msg, { video });
      throw new Error(msg);
    }

    const saved = await repo.findOneBy({ url: videoEntity.url });

    if (saved) {
      return saved;
    }

    const newVideo = await repo.save(videoEntity);
    return newVideo;
  };

  const app = express();

  app.use(bodyParser.json());
  app.use((req, res, next) => {
    log.debug('Authorizing request...');
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (req.headers['x-password'] !== cfg.password) {
      log.error(`Invalid password from ${ip}, got ${req.headers['x-password']} instead of ${cfg.password}`);
      res.status(401).send('Unauthorized');
      return;
    }
    log.debug('Authorized');

    next();
  });

  app.post('/video/get-url-to-crawl', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    req.setTimeout(1000 * 5);
    const u = await getVideoToCrawl();

    if (u.ok) {
      log.info(`Sent video to crawl ${u.url} to ${ip}`);
      res.status(200).json(u);
    } else {
      log.info(`No video to crawl for ${ip}`);
      res.status(504).json(u);
    }
  });

  app.post('/recommendation', async (req, res) => {
    const data = new ScrapedRecommendation(req.body.from, req.body.to);
    const errors = await validate(data);
    if (errors.length > 0) {
      log.error('Invalid recommendations', { errors });
      res.status(400).json({ OK: false, count: 0 });
      throw new Error('Error in recommendations data.');
    }

    log.info('Received recommendations to save.');

    try {
      const videoRepo = ds.getRepository(Video);
      const from = await videoRepo.findOneBy({ url: data.from.url });

      if (from) {
        const recommendations = await ds.getRepository(Recommendation).findBy({
          fromId: from.id,
        });

        if (recommendations.length >= 10) {
          log.info('Recommendations already exist.');
          res.status(201).json({ ok: true, count: 0 });
          return;
        }
      }

      await ds.manager.transaction(async (transaction: EntityManager) => {
        const from = await saveVideo(videoRepo, channelRepo, data.from);

        from.crawled = true;

        const saves = Object.entries(data.to)
          .map(async ([rank, video]): Promise<Recommendation> => {
          // eslint-disable-next-line no-await-in-loop
            const to = await saveVideo(videoRepo, channelRepo, video);

            log.info(`Saving recommendation from ${from.id} to ${to.id}`);

            const recommendation = new Recommendation();
            recommendation.fromId = from.id;
            recommendation.toId = to.id;
            recommendation.createdAt = new Date();
            recommendation.updatedAt = new Date();
            recommendation.rank = +rank;
            return transaction.save(recommendation);
          });

        await Promise.all(saves);
        await transaction.save(from);

        recommendationsSaved += data.to.length;
        const elapsed = (Date.now() - countingRecommendationsSince) / 1000 / 60;

        if (elapsed > 0) {
          const recommendationsPerMinute = Math.round(recommendationsSaved / elapsed);
          log.info(`Saved recommendations per minute: ${recommendationsPerMinute}`);

          // resetting the average every 10 minutes
          if (elapsed > 10) {
            countingRecommendationsSince = Date.now();
            recommendationsSaved = 0;
          }
        }
      });

      log.info(await ds.query('select count(*) from recommendation'));

      res.json({ ok: true, count: data.to.length });
    } catch (error) {
      const { message } = asError(error);
      log.error(`Could not save recommendations: ${message}`, { error });
      res.status(500).send({ ok: false, message });
    }
  });

  const server = app.listen(
    // eslint-disable-next-line no-console
    cfg.port, () => console.log(`Listening on port ${cfg.port}`, '0.0.0.0'),
  );

  app.post('/testing/resetTime', async (req, res) => {
    const dt = 1000 * 60 * 10 * 2;
    countingVideosAskedSince = -dt;
    seedVideoSentAt = new Date(0);
    res.json({ ok: true });
  });

  app.post('/testing/clearDb', async (req, res) => {
    const queries = [
      'truncate recommendation cascade',
      'truncate video cascade',
      'truncate channel cascade',
    ];

    queries.forEach(async (query) => {
      await ds.query(query);
    });

    res.json({ queries });
  });

  return {
    pg,
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

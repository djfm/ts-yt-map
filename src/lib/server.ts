import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource, EntityManager, LessThan } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { validate } from 'class-validator';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import geoip from 'geoip-lite';

import ScrapedVideoData, { Video } from '../video';
import { Channel, ScrapedChannelData } from '../channel';
import { Client } from '../client';
import { Recommendation } from '../recommendation';
import { ScrapedRecommendation } from '../scraper';
import { ServerConfig, LoggerInterface } from '../lib';
import {
  POSTGetUrlToCrawl,
  POSTRecommendation,
  POSTResetTimingForTesting,
  POSTClearDbForTesting,
  GETRoot,
  GETClient,
  POSTClient,
  POSTLogin,
  GETIP,
  POSTClientCreate,
  GETPing,
} from '../endpoints/v1';

export interface ServerHandle {
  close: () => Promise<void>,
  pg: PgClient,
  ds: DataSource,
}

const asError = (e: unknown):Error => {
  if (e instanceof Error) {
    return e;
  }
  return new Error('Unknown error');
};

let countingRecommendationsSince = Date.now();
let recommendationsSaved = 0;

export const startServer = async (
  cfg: ServerConfig, log: LoggerInterface,
): Promise<ServerHandle> => {
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
    entities: [Video, Channel, Recommendation, Client],
    namingStrategy: new SnakeNamingStrategy(),
  });

  await ds.initialize();

  type URLResp = { ok: true, url: string } | { ok: false };

  const getVideoToCrawl = async (client: Client): Promise<URLResp> => {
    const resp = await ds.transaction(async (manager: EntityManager): Promise<URLResp> => {
      const video = await manager.findOne(Video, {
        where: {
          crawled: false,
          crawlAttemptCount: LessThan(4),
          latestCrawlAttemptedAt: LessThan(new Date(Date.now() - 1000 * 60 * 10)),
          clientId: client.id,
        },
        order: { url: 'ASC' },
      });

      if (video) {
        video.latestCrawlAttemptedAt = new Date();
        video.crawlAttemptCount += 1;
        await manager.save(video);
        return { ok: true, url: video.url };
      }

      if (client.seed) {
        return { ok: true, url: client.seed };
      }

      return { ok: false };
    });

    return resp;
  };

  const saveChannelAndGetId = async (
    repo: EntityManager, channel: ScrapedChannelData,
  ): Promise<number> => {
    const currentChannel = await repo.findOneBy(Channel, {
      youtubeId: channel.youtubeId,
    });

    if (currentChannel) {
      return currentChannel.id;
    }

    const newChannel = new Channel(channel);
    const newChannelErrors = await validate(newChannel);
    if (newChannelErrors.length > 0) {
      log.error('Failed to save channel');
      log.error(newChannelErrors);
      throw new Error('Failed to save channel');
    }
    const savedChannel = await repo.save(newChannel);
    return savedChannel.id;
  };

  const saveVideo = async (
    em: EntityManager, video: ScrapedVideoData,
  ): Promise<Video> => {
    if (!video.channel) {
      throw new Error('Video must have a channel');
    }

    const channelId = await saveChannelAndGetId(em, video.channel);

    const videoEntity = new Video(video);
    videoEntity.channelId = channelId;
    const videoErrors = await validate(videoEntity);
    if (videoErrors.length > 0) {
      const msg = `Invalid video: ${JSON.stringify(videoErrors)}`;
      log.error(msg, { video });
      throw new Error(msg);
    }

    const saved = await em.findOneBy(Video, { url: videoEntity.url });

    if (saved) {
      return saved;
    }

    const newVideo = await em.save(videoEntity);
    return newVideo;
  };

  const app = express();

  app.set('view engine', 'pug');
  app.set('views', './views');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(async (req, res, next) => {
    log.debug(`Authorizing request (expected password is "${cfg.password}")...`);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (typeof ip !== 'string') {
      log.error('Invalid IP address', { ip });
      res.status(500).json({ message: 'Invalid IP address', ip });
      return;
    }

    req.ip = ip;

    const client = await ds.transaction(async (manager: EntityManager): Promise<Client> => {
      const client = await manager.findOneBy(Client, { ip });
      if (client) {
        return client;
      }
      const newClient = new Client({ ip });
      const geo = geoip.lookup(ip);
      if (geo) {
        newClient.country = geo.country;
        newClient.city = geo.city;
      } else {
        log.info('Failed to lookup geoip', { ip });
        newClient.country = 'Unknown';
        newClient.city = 'Unknown';
      }
      newClient.name = `${newClient.country} - ${newClient.city}`;
      return manager.save(newClient);
    });

    req.client = client;

    if (req.body.password === cfg.password) {
      log.debug(`Authorized request for ${ip} via body, setting password in cookie.`);
      res.cookie('password', cfg.password);
      next();
      return;
    }

    if (req.cookies && req.cookies.password === cfg.password) {
      log.debug(`Authorized request for ${ip} via cookie.`);
      next();
      return;
    }

    if (req.headers['x-password'] === cfg.password) {
      log.debug(`Authorized request for ${ip} via header.`);
      next();
      return;
    }

    res.status(401).render('unauthorized');
  });

  app.get(GETPing, (req, res) => {
    res.json({ pong: true });
  });

  app.post(POSTLogin, (req, res) => {
    res.redirect(GETClient);
  });

  app.get(GETClient, async (req, res) => {
    res.status(200).render('client', req.client);
  });

  app.post(POSTClient, async (req, res) => {
    if (req.body.seed) {
      const clientRepo = ds.getRepository(Client);
      req.client.seed = req.body.seed;
      await clientRepo.save(req.client);
      res.redirect(GETClient);
    }
  });

  app.post(POSTGetUrlToCrawl, async (req, res) => {
    log.debug('Getting video to crawl...');
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (typeof ip !== 'string') {
      res.status(500).json({ message: 'Invalid IP address', ip });
      return;
    }

    const { client } = req;

    const u = await getVideoToCrawl(client);

    if (u.ok) {
      log.info(`Sent video to crawl ${u.url} to ${ip}`);
      res.status(200).json(u);
    } else {
      log.info(`No video to crawl for ${ip}`);
      res.status(504).json(u);
    }
  });

  app.post(POSTResetTimingForTesting, (req, res) => {
    countingRecommendationsSince = Date.now();
    recommendationsSaved = 0;
    res.status(200).json({ ok: true });
  });

  app.post(POSTRecommendation, async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (typeof ip !== 'string') {
      res.status(500).json({ ok: false });
      return;
    }

    const clientManager = ds.manager.getRepository(Client);
    const client = await clientManager.findOneBy({ ip });

    if (!client) {
      res.status(500).json({ ok: false });
      return;
    }

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

      await ds.manager.transaction(async (em: EntityManager) => {
        data.from.clientId = client.id;
        const from = await saveVideo(em, data.from);

        from.crawled = true;

        const saves = Object.entries(data.to)
          .map(async ([rank, video]): Promise<Recommendation> => {
            // eslint-disable-next-line no-await-in-loop
            const to = await saveVideo(em, { ...video, clientId: client.id });

            log.info(`Saving recommendation from ${from.id} to ${to.id}`);

            const recommendation = new Recommendation();
            recommendation.fromId = from.id;
            recommendation.toId = to.id;
            recommendation.createdAt = new Date();
            recommendation.updatedAt = new Date();
            recommendation.rank = +rank;
            try {
              return await em.save(recommendation);
            } catch (e) {
              log.error(`Failed to save recommendation from ${from.id} to ${to.id}: ${asError(e).message}`, { e });
              throw e;
            }
          });

        await Promise.all(saves);
        await em.save(from);

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

        res.json({ ok: true, count: data.to.length });
      });
    } catch (error) {
      const { message } = asError(error);
      log.error(`Could not save recommendations: ${message}`, { error });
      log.error(error);
      res.status(500).send({ ok: false, message });
    }
  });

  const server = app.listen(
    // eslint-disable-next-line no-console
    cfg.port, '0.0.0.0', () => log.info(`Listening on port ${cfg.port}`, '0.0.0.0'),
  );

  app.post(POSTClearDbForTesting, async (req, res) => {
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

  app.get(GETRoot, async (req, res) => {
    res.json({ ok: true });
  });

  app.get(GETIP, (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (typeof ip !== 'string') {
      const err = `Could not get IP: ${JSON.stringify(ip)}`;
      log.error(err);
      res.status(500).json({ message: err });
      return;
    }
    res.json({ ip });
  });

  app.post(POSTClientCreate, async (req, res) => {
    const client = new Client(req.body);
    const errors = await validate(client);
    if (errors.length > 0) {
      log.error('Invalid client');
      log.error(errors.join('\n'));
      res.status(400).json({ OK: false, count: 0 });
      return;
    }

    const clientManager = ds.manager.getRepository(Client);
    const existing = await clientManager.findOneBy({ ip: client.ip });

    if (existing) {
      Object.assign(client, existing);
    }

    await clientManager.save(client);
    res.json(client);
  });

  return {
    pg,
    ds,
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

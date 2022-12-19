import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource, EntityManager, LessThan } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { validate } from 'class-validator';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import geoip from 'geoip-lite';

import ScrapedVideoData, { Video } from '../models/video';
import { Channel, ScrapedChannelData } from '../models/channel';
import { Client } from '../models/client';
import { Recommendation } from '../models/recommendation';
import { Project, CreateProjectPayload } from '../models/project';
import { URLModel } from '../models/url';
import { withLock } from '../util';

import { ScrapedRecommendationData } from '../scraper';
import { ServerConfig, LoggerInterface } from '../lib';

import {
  POSTGetUrlToCrawl,
  POSTRecommendation,
  POSTResetTimingForTesting,
  POSTClearDbForTesting,
  GETRoot,
  GETIP,
  GETPing,
  POSTCreateProject,
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

const sentURLsToCrawl = new Set<string>();

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
    entities: [Video, Channel, Recommendation, Client, Project, URLModel],
    namingStrategy: new SnakeNamingStrategy(),
  });

  await ds.initialize();

  // automatically clear the "crawling flag" on videos that are still marked
  // as "crawling" 15 minutes after the latest crawl attempt
  const updateCrawlingFlag = async () => {
    try {
      await ds.createQueryBuilder()
        .update(Video)
        .set({ crawling: false })
        .where({ crawling: true })
        .andWhere({ latestCrawlAttemptedAt: LessThan(new Date(Date.now() - 15 * 60 * 1000)) })
        .execute();
    } catch (e) {
      log.error('Failed to update crawling flag', { error: e });
    }
  };

  // update the crawling flag every 15 minutes
  setInterval(updateCrawlingFlag, 15 * 60 * 1000);

  type URLResp = { ok: true, url: string } | { ok: false };

  const getVideoToCrawl = async (client: Client): Promise<URLResp> => {
    const repo = ds.manager.getRepository(Video);

    const video = await repo.findOne({
      where: {
        crawled: false,
        crawling: false,
        crawlAttemptCount: LessThan(4),
        clientId: client.id,
      },
      order: { url: 'ASC' },
    });

    if (video) {
      const now = new Date();
      video.latestCrawlAttemptedAt = now;
      video.updatedAt = now;
      video.latestCrawlAttemptedAt = now;
      video.crawlAttemptCount += 1;
      video.crawling = true;

      await repo.save(video);
      return { ok: true, url: video.url };
    }

    if (client.seed) {
      return { ok: true, url: client.seed };
    }

    return { ok: false };
  };

  const getFirstLevelRecommendationsUrlToCrawl = async (projectId: number):
    Promise<URLModel | null> => {
    const repo = ds.manager.getRepository(URLModel);

    const url = await repo.findOne({
      where: {
        crawled: false,
        crawlAttemptCount: LessThan(4),
        latestCrawlAttemptedAt: LessThan(new Date(Date.now() - 1000 * 60 * 10)),
        projectId,
      },
      order: { id: 'ASC' },
    });

    if (url) {
      url.latestCrawlAttemptedAt = new Date();
      url.updatedAt = new Date();
      url.crawlAttemptCount += 1;
      await repo.save(url);
    }

    return url;
  };

  const getOrCreateClient = async (name: string, ip: string, seed: string) => {
    const client = await ds.transaction(async (manager: EntityManager): Promise<Client> => {
      const client = await manager.findOneBy(Client, { ip, name });
      if (client) {
        return client;
      }
      const newClient = new Client({ ip, name });
      const geo = geoip.lookup(ip);
      if (geo) {
        newClient.country = geo.country;
        newClient.city = geo.city;
      } else {
        log.info('Failed to lookup geoip', { ip });
        newClient.country = 'Unknown';
        newClient.city = 'Unknown';
      }
      newClient.name = name;
      newClient.seed = seed;
      return manager.save(newClient);
    });

    return client;
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
    em: EntityManager, video: ScrapedVideoData, projectId: number,
  ): Promise<Video> => {
    if (!video.channel) {
      throw new Error('Video must have a channel');
    }

    const channelId = await saveChannelAndGetId(em, video.channel);

    const videoEntity = new Video(video);
    videoEntity.channelId = channelId;
    videoEntity.projectId = projectId;

    const videoErrors = await validate(videoEntity);
    if (videoErrors.length > 0) {
      const msg = `Invalid video: ${JSON.stringify(videoErrors)}`;
      log.error(msg, { video });
      throw new Error(msg);
    }

    const saved = await em.findOneBy(Video, { url: videoEntity.url, projectId });

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
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get(GETPing, (req, res) => {
    res.json({ pong: true });
  });

  app.post(POSTGetUrlToCrawl, async (req, res) => {
    log.debug('Getting video to crawl...');

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (typeof ip !== 'string') {
      res.status(500).json({ message: 'Invalid IP address', ip });
      return;
    }

    const projectRepo = ds.getRepository(Project);
    const project = await projectRepo.findOneBy({ id: req.body.project_id });

    log.info({ ip, project, reqBody: req.body });

    if (!project) {
      res.status(500).json({ message: 'Invalid or missing project ID' });
      return;
    }

    if (project.type === 'exploration') {
      // eslint-disable-next-line camelcase
      const { seed_video, client_name } = req.body;

      // eslint-disable-next-line camelcase
      if (!seed_video || !(typeof seed_video === 'string')) {
        res.status(400).json({ ok: false, message: 'Missing seed video' });
        return;
      }

      await withLock('exploration', async () => {
        const client = await getOrCreateClient(client_name, ip, seed_video);

        const u = await getVideoToCrawl(client);

        if (u.ok) {
          if (sentURLsToCrawl.has(u.url)) {
            log.info(`Already sent ${u.url} to a client`);
            res.status(500).json({ ok: false, message: 'URL already sent to parse' });
            return;
          }

          sentURLsToCrawl.add(u.url);

          setTimeout(() => {
            sentURLsToCrawl.delete(u.url);
          }, 1000 * 60 * 15);

          log.info(`Sent video to crawl ${u.url} to ${ip} (client with id ${client.id})`);
          res.status(200).json(u);
        } else {
          log.info(`No video to crawl for ${ip}`);
          res.status(503).json(u);
        }
      });
    } else if (project.type === 'first level recommendations') {
      try {
        await withLock(`first-level-recommendations-${project.id}`, async () => {
          const url = (await getFirstLevelRecommendationsUrlToCrawl(project.id))?.url ?? '';

          if (url) {
            log.info(`Sent first level recommendations url to crawl ${url} to ${ip}`);
          } else {
            log.info(`No first level recommendations url to crawl for ${ip}`);
          }

          res.status(200).json({ url });
        });
      } catch (err) {
        log.error(err);
        res.status(500).json({ message: asError(err).message });
      }
    } else {
      res.status(500).json({ message: 'Invalid project type' });
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

    const project = await ds.getRepository(Project).findOneBy({ id: req.body.projectId });

    if (!project) {
      res.status(500).json({ ok: false, message: 'invalid project id' });
      return;
    }

    log.info(`Received recommendations to save for project ${project.id} from ${ip}`);

    const data = new ScrapedRecommendationData(
      req.body.client_name,
      req.body.projectId,
      req.body.from,
      req.body.to,
    );
    const errors = await validate(data);
    if (errors.length > 0) {
      log.error('Invalid recommendations', { errors });
      res.status(400).json({ OK: false, count: 0 });
      throw new Error('Error in recommendations data.');
    }

    const clientManager = ds.manager.getRepository(Client);
    // eslint-disable-next-line camelcase
    const client = await clientManager.findOneBy({ ip, name: data.client_name });

    if (!client) {
      res.status(500).json({ ok: false });
      return;
    }

    sentURLsToCrawl.delete(data.from.url);

    try {
      const videoRepo = ds.getRepository(Video);
      const from = await videoRepo.findOneBy({ url: data.from.url, projectId: data.projectId });

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
        const from = await saveVideo(em, data.from, data.projectId);

        from.crawled = true;
        from.crawling = false;

        const saves = Object.entries(data.to)
          .map(async ([rank, video]): Promise<Recommendation> => {
            // eslint-disable-next-line no-await-in-loop
            const to = await saveVideo(em, { ...video, clientId: client.id }, data.projectId);

            log.info(`Saving recommendation from ${from.id} to ${to.id} for client ${client.id} (${client.name})`);

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

        if (project.type === 'first level recommendations') {
          const urlsRepo = ds.getRepository(URLModel);
          const url = await urlsRepo.findOneByOrFail({
            url: data.from.url,
            projectId: data.projectId,
          });

          url.crawled = true;
          url.updatedAt = new Date();
          await urlsRepo.save(url);
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

  app.post(POSTCreateProject, async (req, res) => {
    const payload = new CreateProjectPayload();
    Object.assign(payload, req.body);

    const errors = await validate(payload);
    if (errors.length > 0) {
      log.error('Invalid project data', { errors });
      res.status(400).json({ ok: false, errors });
      return;
    }

    const project = new Project();
    project.name = payload.name;
    project.description = payload.description;
    project.createdAt = new Date();
    project.updatedAt = new Date();

    try {
      const responseData = await ds.manager.transaction(async (em: EntityManager) => {
        const savedProject = await em.save(project);

        for (const url of payload.urls) {
          const m = new URLModel();

          m.projectId = savedProject.id;
          m.url = url;
          m.createdAt = new Date();
          m.updatedAt = new Date();

          // eslint-disable-next-line no-await-in-loop
          await em.save(m);
        }

        return savedProject;
      });

      res.json(responseData);
    } catch (error) {
      const { message } = asError(error);
      log.error(`Could not save project: ${message}`, { error });
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

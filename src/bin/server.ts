import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource } from 'typeorm';
import express from 'express';
import bodyParser from 'body-parser';
import { validate } from 'class-validator';

import { loadConfig, log } from '../lib';

import { Video } from '../video';
import { Channel } from '../channel';
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
  });

  await ds.initialize();
  const videoRepo = ds.getRepository(Video);
  const channelRepo = ds.getRepository(Channel);
  const recommendationRepo = ds.getRepository(Recommendation);

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
      // TODO
    }
  });

  app.post('/recommendations', async (req, res) => {
    const data = req.body as ScrapedRecommendationData;

    const channel = new Channel(data.fromChannel);
    const channelErrors = await validate(channel);
    if (channelErrors.length > 0) {
      log.error(`Invalid channel data: ${JSON.stringify(channelErrors)}`);
      res.status(400).send(channelErrors);
      return;
    }
    const savedChannel = await channelRepo.save(channel);

    const from = new Video(data.from);
    from.channelId = savedChannel.id;
    const fromErrors = await validate(from);
    if (fromErrors.length > 0) {
      log.error(`Invalid "from" video data: ${JSON.stringify(fromErrors)}`);
      res.status(400).send(fromErrors);
      return;
    }
    const savedFrom = await videoRepo.save(from);

    for (const [rank, video] of Object.entries(data.to)) {
      const to = new Video(video);
      // eslint-disable-next-line no-await-in-loop
      const toErrors = await validate(to);
      if (toErrors.length > 0) {
        log.error(`Invalid "to" video data: ${JSON.stringify(toErrors)}`);
        res.status(400).send(toErrors);
        return;
      }
      // eslint-disable-next-line no-await-in-loop
      const savedTo = await videoRepo.save(to);

      const recommendation = new Recommendation();
      recommendation.from_id = savedFrom.id;
      recommendation.to_id = savedTo.id;
      recommendation.created_at = new Date();
      recommendation.updated_at = new Date();
      recommendation.rank = +rank;
      // eslint-disable-next-line no-await-in-loop
      await recommendationRepo.save(recommendation);
    }
  });

  app.listen(
    // eslint-disable-next-line no-console
    cfg.server.port, () => console.log(`Listening on port ${cfg.server.port}`),
  );
}

main();

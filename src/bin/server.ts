import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource } from 'typeorm';
import express from 'express';

import { loadConfig } from '../lib';

import { Video } from '../video';

async function main() {
  const cfg = loadConfig();
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
    entities: [Video],
  });

  await ds.initialize();
  const video = ds.getRepository(Video);

  const app = express();

  app.post('/video/get-url-to-crawl', async (req, res) => {
    const v = await video.query(`
      UPDATE video set latest_crawl_attempted_at = now()
      WHERE id = (SELECT min(id) FROM video WHERE now() - latest_crawl_attempted_at > '10 minutes'::interval OR latest_crawl_attempted_at IS NULL)
      RETURNING url
    `);

    console.log(v);
    res.send({ to: 'do' });
  });

  app.listen(
    // eslint-disable-next-line no-console
    cfg.server.port, () => console.log(`Listening on port ${cfg.server.port}`),
  );
}

main();

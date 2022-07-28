import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';
import { DataSource } from 'typeorm';

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
}

main();

import { Client as PgClient } from 'pg';
import { migrate } from 'postgres-migrations';

import { loadConfig } from '../lib';

async function main() {
  const cfg = loadConfig();
  const pg = new PgClient(cfg.server.db_connection_string);

  await pg.connect();
  await migrate({ client: pg }, 'data/migrations');
}

main().then(() => {
  process.exit(0);
}, console.error);

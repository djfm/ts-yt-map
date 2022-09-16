import { loadServerConfig, createLogger } from '../lib';
import startServer from '../lib/server';

async function main() {
  const log = await createLogger();
  const cfg = await loadServerConfig({ password: 'SERVER_PASSWORD' });
  await startServer(cfg, log);
}

main();

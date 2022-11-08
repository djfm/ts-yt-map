import { loadConfig, createLogger } from '../lib';
import startServer from '../lib/server';

async function main() {
  const log = await createLogger();
  log.info('Starting server...');
  log.info(process.argv);
  const cfg = await loadConfig(process.argv[2]);
  await startServer(cfg, log);
}

main();

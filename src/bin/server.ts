import { loadServerConfig, log } from '../lib';
import startServer from '../lib/server';

async function main() {
  const password = process.argv[2];

  if (typeof password !== 'string') {
    // eslint-disable-next-line no-console
    console.error('Usage: ts-node src/bin/server.ts <password>');
    process.exit(1);
  }

  const cfg = await loadServerConfig(password);
  await startServer(cfg, log);
}

main();

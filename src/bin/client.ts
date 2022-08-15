import { API } from '../lib/api';
import { Client } from '../lib/client';
import { createLogger } from '../lib';
import { sleep } from '../util';

const server = process.argv[2];
const password = process.argv[3];

if (typeof server !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Usage: ts-node client.js <server> <password>');
  process.exit(1);
}

if (typeof password !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Usage: ts-node client.js <server> <password>');
  process.exit(1);
}

const main = async () => {
  const log = await createLogger();
  const api = new API(log, server, password);
  const client = new Client(log, api);

  for (;;) {
    try {
      log.info('Scraping one video and its recommendations...');
      // eslint-disable-next-line no-await-in-loop
      await client.scrapeOneVideoAndItsRecommendations();
    } catch (e) {
      log.error(e);
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
  }
};

main();

import { API } from '../lib/api';
import { Client } from '../lib/client';
import { createLogger } from '../lib';
import { sleep } from '../util';

// for the experimental fetch API
process.removeAllListeners('warning');

const server = process.env.SERVER;
const password = process.env.SERVER_PASSWORD;

if (typeof server !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Missing SERVER environment variable');
  process.exit(1);
}

if (typeof password !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Missing SERVER_PASSWORD environment variable');
  process.exit(1);
}

const main = async () => {
  const log = await createLogger();
  log.info(`Starting client, connecting to server ${server} with password ${password}...`);
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

main().then(() => { process.exit(0); }, async (err) => {
  const log = await createLogger();
  log.error(err.message);
  log.error(err.stack);
  process.exit(1);
});

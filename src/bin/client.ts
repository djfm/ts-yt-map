import { API } from '../lib/api';
import { Client, ClientSettings } from '../lib/client';
import { createLogger, loadConfig } from '../lib';
import { sleep } from '../util';

// for the experimental fetch API
process.removeAllListeners('warning');

const server = process.env.SERVER;
const password = process.env.SERVER_PASSWORD;
const preProjectId = process.env.PROJECT_ID;

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

if (typeof preProjectId !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Missing PROJECT_ID environment variable');
  process.exit(1);
}

const projectId = parseInt(preProjectId, 10);

const main = async () => {
  const log = await createLogger();
  const config = await loadConfig();

  const clientSettings = new ClientSettings(config.client_name, config.seed_video, projectId);

  log.info(`Starting client, connecting to server ${server} with password ${password}...`);
  const api = new API(log, server, password, clientSettings);
  const client = new Client(log, api, clientSettings);

  for (;;) {
    try {
      log.info('Scraping one video and its recommendations...');
      // eslint-disable-next-line no-await-in-loop
      await client.scrapeOneVideoAndItsRecommendations();
    } catch (e) {
      log.error(e);
      // eslint-disable-next-line no-await-in-loop
      await sleep(5000);
    }
  }
};

main().then(() => { process.exit(0); }, async (err) => {
  const log = await createLogger();
  log.error(err.message);
  log.error(err.stack);
  process.exit(1);
});

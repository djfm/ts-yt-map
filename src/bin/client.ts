import ScrapedRecommendationData from '../scraper';
import { sleep } from '../util';
import { log } from '../lib';
import { Client } from '../lib/api';

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

const api = new Client(log, server, password);

const scrapeOneVideoAndItsRecommendations = async (): Promise<void> => {
  const url = await api.getUrlToCrawl();
  const scraped = await ScrapedRecommendationData.scrapeRecommendations(url);
  await api.saveRecommendations(scraped);
};

const main = async () => {
  for (;;) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await scrapeOneVideoAndItsRecommendations();
    } catch (e) {
      log.error(e);
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
  }
};

main();

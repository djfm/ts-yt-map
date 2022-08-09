import fetch from 'node-fetch';
import ScrapedRecommendationData from '../scraper';
import { loadConfig } from '../lib';

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

const scrapeOneVideoAndItsRecommendations = async (): Promise<void> => {
  const cfg = loadConfig(password);

  const urlResp = await fetch(`${server}/video/get-url-to-crawl`, {
    method: 'POST',
    headers: {
      'X-Password': password,
    },
  });

  if (urlResp.ok) {
    const u = await urlResp.json();
    const scraped = await ScrapedRecommendationData.scrapeRecommendations(u.url);
    await fetch(`${server}/recommendation`, {
      method: 'POST',
      headers: {
        'X-Password': password,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scraped),
    });
  } else {
    throw new Error('Failed to get URL to crawl');
  }
};

const main = async () => {
  try {
    for (;;) {
      // eslint-disable-next-line no-await-in-loop
      await scrapeOneVideoAndItsRecommendations();
    }
  } catch (e) {
    console.log(e);
    // ignore
  }
};

main();

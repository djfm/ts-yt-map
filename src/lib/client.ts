import { Response } from 'node-fetch';
import { API } from './api';
import { Scraper } from '../scraper';
import { LoggerInterface } from '../lib';

export class Client {
  constructor(private readonly log: LoggerInterface, private readonly api: API) {}

  async scrapeOneVideoAndItsRecommendations(): Promise<Response> {
    const url = await this.api.getUrlToCrawl();
    const scraper = new Scraper(this.log);
    const scraped = await scraper.scrapeRecommendations(url);
    const res = await this.api.saveRecommendations(scraped);

    if (!res.ok) {
      this.log.error(res);
      throw new Error('Failed to save recommendations');
    }

    const data = await res.json();
    console.log(`Saved ${data.count} recommendations`);

    return res;
  }
}

export default Client;

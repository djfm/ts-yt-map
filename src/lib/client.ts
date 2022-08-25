import { API } from './api';
import { Scraper } from '../scraper';
import { LoggerInterface } from '../lib';

export class Client {
  constructor(private readonly log: LoggerInterface, private readonly api: API) {}

  async scrapeOneVideoAndItsRecommendations(): Promise<{ ok: boolean, count: number }> {
    const url = await this.api.getUrlToCrawl();
    const scraper = new Scraper(this.log);
    const scraped = await scraper.scrapeRecommendations(url);
    return this.api.saveRecommendations(scraped);
  }
}

export default Client;

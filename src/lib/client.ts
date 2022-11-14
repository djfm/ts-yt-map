import { API } from './api';
import { Scraper } from '../scraper';
import { LoggerInterface } from '../lib';

export class ClientSettings {
  constructor(
    public readonly name: string,
    public readonly seedVideo: string,
    public readonly projectId: number,
  ) {}
}

export class Client {
  constructor(
    private readonly log: LoggerInterface,
    private readonly api: API,
    private readonly clientSettings: ClientSettings,
  ) {}

  async scrapeOneVideoAndItsRecommendations(): Promise<{ ok: boolean, count: number }> {
    const url = await this.api.getUrlToCrawl();

    if (!url) {
      this.log.info('No more URLs to crawl, done!');
      return { ok: true, count: 0 };
    }

    const scraper = new Scraper(this.log, this.clientSettings);
    const scraped = await scraper.scrapeRecommendations(url);
    let tries = 3;
    try {
      return await this.api.saveRecommendations(scraped);
    } catch (e) {
      this.log.error(`Failed to save recommendations for URL: ${url}, retrying`, { error: e });
      if (tries > 0) {
        tries -= 1;
        return this.api.saveRecommendations(scraped);
      }
      this.log.error(`Failed to save recommendations for URL: ${url}`, { error: e });
      throw e;
    }
  }
}

export default Client;

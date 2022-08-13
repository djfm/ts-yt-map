import fetch from 'node-fetch';
import { LoggerInterface } from '../lib';
import ScrapedRecommendationData from '../scraper';

export class Client {
  constructor(
    private readonly log: LoggerInterface,
    private readonly url: string,
    private readonly password: string,
  ) {}

  public async getUrlToCrawl(): Promise<string> {
    const urlResp = await fetch(`${this.url}/video/get-url-to-crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': this.password,
      },
    });

    if (urlResp.ok) {
      const u = await urlResp.json();
      return u.url;
    }

    this.log.error(urlResp);
    throw new Error('Failed to get URL to crawl');
  }

  public async saveRecommendations(recoData: ScrapedRecommendationData): Promise<void> {
    const res = await fetch(`${this.url}/recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': this.password,
      },
      body: JSON.stringify(recoData),
    });

    if (!res.ok) {
      this.log.error(res);
      throw new Error('Failed to save recommendations');
    }
  }
}

export default Client;

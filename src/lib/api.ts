import fetch, { Response } from 'node-fetch';
import { LoggerInterface } from '../lib';
import { ScrapedRecommendationData } from '../scraper';

export class API {
  constructor(
    private readonly log: LoggerInterface,
    private readonly url: string,
    private readonly password: string,
  ) {}

  public async getUrlToCrawl(): Promise<string> {
    let urlResp: Response;

    try {
      urlResp = await fetch(`${this.url}/video/get-url-to-crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-password': this.password,
        },
      });
    } catch (e) {
      this.log.error('Failed to get URL to crawl', { error: e });
      this.log.error(`Server URL was: ${this.url}`);
      throw e;
    }

    if (urlResp.ok) {
      const u = await urlResp.json();
      return u.url;
    }

    this.log.error(urlResp);
    throw new Error('Failed to get URL to crawl');
  }

  public async saveRecommendations(
    recoData: ScrapedRecommendationData,
  ): Promise<{ok: boolean, count: number}> {
    const res = await fetch(`${this.url}/recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': this.password,
      },
      body: JSON.stringify(recoData),
    });

    if (res.ok) {
      return res.json();
    }

    this.log.error(res);
    throw new Error('Failed to save recommendations');
  }
}

export default API;

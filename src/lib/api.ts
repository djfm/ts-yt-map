import { LoggerInterface } from '../lib';
import { ScrapedRecommendationData } from '../scraper';
import { GETIP, POSTClearDbForTesting, POSTClientCreate, POSTGetUrlToCrawl, POSTRecommendation } from '../endpoints/v1';
import Client from '../client';

const hasURL = (o: unknown): o is { url: string } =>
  typeof o === 'object' && o !== null && 'url' in o
  && typeof (o as { url: string }).url === 'string';

const hasCount = (o: unknown): o is { ok: true, count: number } =>
  typeof o === 'object' && o !== null && 'ok' in o && 'count' in o
  && typeof (o as { ok: true, count: number }).ok === 'boolean';

const hasQueries = (o: unknown): o is { queries: string[] } =>
  typeof o === 'object' && o !== null && 'queries' in o
  && Array.isArray((o as { queries: unknown }).queries);
export class API {
  constructor(
    private readonly log: LoggerInterface,
    private readonly url: string,
    private readonly password: string,
  ) {}

  public async getUrlToCrawl(): Promise<string> {
    let urlResp: Response;

    try {
      urlResp = await fetch(`${this.url}${POSTGetUrlToCrawl}`, {
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
      if (hasURL(u)) {
        return u.url;
      }
    }

    this.log.error(urlResp);
    throw new Error('Failed to get URL to crawl');
  }

  public async saveRecommendations(
    recoData: ScrapedRecommendationData,
  ): Promise<{ok: boolean, count: number}> {
    const res = await fetch(`${this.url}${POSTRecommendation}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': this.password,
      },
      body: JSON.stringify(recoData),
    });

    if (res.ok) {
      const got = await res.json();
      if (hasCount(got)) {
        return got;
      }
    }

    this.log.error(res.statusText, { res });
    throw new Error('Failed to save recommendations');
  }

  public async forTestingClearDb(): Promise<{queries: string[]}> {
    const res = await fetch(`${this.url}${POSTClearDbForTesting}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': this.password,
      },
    });

    if (res.ok) {
      const got = await res.json();
      if (hasQueries(got)) {
        return got;
      }
    }

    this.log.error(res.statusText, { res });
    throw new Error('Failed to clear db');
  }

  public async getIP(): Promise<string> {
    const res = await fetch(`${this.url}${GETIP}`);
    const got = await res.json();

    if (res.ok) {
      return got.ip;
    }

    this.log.error(got.message);
    throw new Error(got.message);
  }

  public async createClient(seed: string): Promise<Client> {
    const client = new Client();
    client.city = 'test';
    client.country = 'test';
    client.ip = await this.getIP();
    client.seed = seed;
    const resp = await fetch(`${this.url}${POSTClientCreate}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-password': this.password,
      },
      body: JSON.stringify(client),
    });

    if (resp.ok) {
      return new Client(await resp.json());
    }

    this.log.error(resp.statusText, { resp });
    throw new Error('Failed to create client');
  }
}

export default API;

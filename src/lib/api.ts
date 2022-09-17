import fetch, { Response } from 'node-fetch';

import { LoggerInterface } from '../lib';
import { ScrapedRecommendationData } from '../scraper';
import { GETIP, POSTClearDbForTesting, POSTClientCreate, POSTGetUrlToCrawl, POSTRecommendation } from '../endpoints/v1';
import Client from '../client';
import Fetch, { Method } from '../fetch';

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

  private fetch = async (method: Method, url: string): Promise<unknown> => {
    const f = new Fetch(url)
      .setFamily(6)
      .setHeader('content-type', 'application/json')
      .setHeader('x-password', this.password)
      .setMethod(method);

    const ok = await f.ok();

    this.log.error(f.text());

    if (ok) {
      return f.json();
    }

    throw new Error(`Call to "${url}" failed.`);
  };

  public async getUrlToCrawl(): Promise<string> {
    const res = await this.fetch('POST', `${this.url}${POSTGetUrlToCrawl}`);
    if (hasURL(res)) {
      return res.url;
    }

    throw new Error('Could not get URL to crawl');
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
    const res = await fetch(`${this.url}${GETIP}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-password': this.password,
      },
    });

    if (res.ok) {
      const got = await res.json();
      return got.ip;
    }

    return Promise.reject(new Error('Failed to get IP'));
  }

  public async createClient(data: Partial<Client> = {}): Promise<Client> {
    const client = new Client(data);
    client.ip = await this.getIP();
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

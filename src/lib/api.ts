import axios from 'axios';

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

const hasIP = (o: unknown): o is { ip: string } =>
  typeof o === 'object' && o !== null && 'ip' in o;

const isClientPartial = (o: unknown): o is Partial<Client> =>
  typeof o === 'object' && o !== null && 'id' in o && 'ip' in o;

export class API {
  constructor(
    private readonly log: LoggerInterface,
    private readonly url: string,
    private readonly password: string,
  ) {}

  private async fetch(method: 'GET' | 'POST', url: string, data?: unknown): Promise<unknown> {
    return axios({
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        'X-Password': this.password,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        this.log.error(err);
        throw err;
      });
  }

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
    const res = await this.fetch('POST', `${this.url}${POSTRecommendation}`);

    if (hasCount(res)) {
      await this.fetch('POST', `${this.url}${POSTRecommendation}`, recoData);

      return res;
    }

    throw new Error('Failed to save recommendations');
  }

  public async forTestingClearDb(): Promise<{queries: string[]}> {
    const res = await this.fetch('POST', `${this.url}${POSTClearDbForTesting}`);

    if (hasQueries(res)) {
      return res;
    }

    throw new Error('Failed to clear db');
  }

  public async getIP(): Promise<string> {
    const res = await this.fetch('GET', `${this.url}${GETIP}`);
    if (hasIP(res)) {
      return res.ip;
    }

    throw new Error('Failed to get IP');
  }

  public async createClient(data: Partial<Client> = {}): Promise<Client> {
    const client = new Client(data);
    client.ip = await this.getIP();
    const resp = await this.fetch('POST', `${this.url}${POSTClientCreate}`);

    if (isClientPartial(resp)) {
      return new Client(resp);
    }

    throw new Error('Failed to create client');
  }
}

export default API;

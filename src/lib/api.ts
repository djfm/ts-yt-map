import axios from 'axios';

import { LoggerInterface, loadConfig } from '../lib';
import { ScrapedRecommendationData } from '../scraper';
import { GETIP, POSTClearDbForTesting, POSTGetUrlToCrawl, POSTRecommendation } from '../endpoints/v1';
import { ClientSettings } from './client';

const hasURL = (o: unknown): o is { url: string } =>
  typeof o === 'object' && o !== null && 'url' in o
  && typeof (o as { url: string }).url === 'string';

const hasMessage = (o: unknown): o is { message: string } =>
  typeof o === 'object' && o !== null && 'message' in o;

const hasResponse = (o: unknown): o is { response: unknown } =>
  typeof o === 'object' && o !== null && 'response' in o;

const hasCount = (o: unknown): o is { ok: true, count: number } =>
  typeof o === 'object' && o !== null && 'ok' in o && 'count' in o
  && typeof (o as { ok: true, count: number }).ok === 'boolean';

const hasQueries = (o: unknown): o is { queries: string[] } =>
  typeof o === 'object' && o !== null && 'queries' in o
  && Array.isArray((o as { queries: unknown }).queries);

const hasIP = (o: unknown): o is { ip: string } =>
  typeof o === 'object' && o !== null && 'ip' in o;

export class API {
  constructor(
    private readonly log: LoggerInterface,
    private readonly url: string,
    private readonly password: string,
    private readonly clientSettings: ClientSettings,
  ) {}

  private async fetch(method: 'GET' | 'POST', url: string, data?: unknown): Promise<unknown> {
    return axios({
      method,
      url,
      data,
      headers: {
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
    try {
      // eslint-disable-next-line camelcase
      const res = await this.fetch('POST', `${this.url}${POSTGetUrlToCrawl}`, {
        seed_video: this.clientSettings.seedVideo,
        client_name: this.clientSettings.name,
      });
      if (hasURL(res)) {
        return res.url;
      }

      throw new Error('Could not get URL to crawl');
    } catch (e) {
      if (hasResponse(e) && hasMessage(e.response)) {
        throw new Error(e.response.message);
      }
      throw e;
    }
  }

  public async saveRecommendations(
    recoData: ScrapedRecommendationData,
  ): Promise<{ok: boolean, count: number}> {
    const res = await this.fetch('POST', `${this.url}${POSTRecommendation}`, recoData);

    if (hasCount(res)) {
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
}

export default API;

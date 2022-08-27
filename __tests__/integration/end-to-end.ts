import { loadServerConfig, ServerConfig, createLogger, LoggerInterface } from '../../src/lib';
import { API } from '../../src/lib/api';
import { Client } from '../../src/lib/client';

const password = 'secret';
let cfg: ServerConfig;
let serverURL: string;
let client: Client;
let log: LoggerInterface;
let api: API;

jest.setTimeout(300000);

beforeAll(async () => {
  try {
    cfg = await loadServerConfig(password);
    serverURL = `http://${cfg.host}:${cfg.port}`;
    log = await createLogger();
    api = new API(log, serverURL, password);
    client = new Client(log, api);
  } catch (e) {
    log.error('Failed to create API', { error: e });
    throw e;
  }
  try {
    const ran = await api.forTestingClearDb();
    ran.queries.forEach((r) => {
      log.info(`RAN: ${r}`);
    });
  } catch (e) {
    log.error('Could not clear DB', { error: e });
  }
});

afterAll(async () => {
  log.close();
});

describe('End-to-end tests', () => {
  it('should ping the server', async () => {
    const res = await api.ping();
    expect(res).toEqual('pong');
  });

  it('should get a URL to crawl from the server', async () => {
    const url = await api.getUrlToCrawl();
    expect(url.length).toBeGreaterThan(0);
  });

  it('should scrape one video and its recommendations', async () => {
    await api.forTestingResetTiming();

    const resp = await client.scrapeOneVideoAndItsRecommendations();
    expect(resp.ok).toBe(true);
    expect(resp.count).toBe(10);
  });

  it('should get 10 different URLs to crawl', async () => {
    const urls = Array(10).fill(0).map(async () => {
      const url = await api.getUrlToCrawl();
      return url;
    });
    const set = new Set(await Promise.all(urls));
    expect(set.size).toBe(10);
  });
});

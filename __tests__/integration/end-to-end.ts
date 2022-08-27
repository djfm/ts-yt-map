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
  cfg = await loadServerConfig(password);
  serverURL = `http://${cfg.host}:${cfg.port}`;
  log = await createLogger();
  api = new API(log, serverURL, password);
  client = new Client(log, api);
  const ran = await api.forTestingClearDb();
  ran.forEach((r) => {
    log.info(`RAN: ${r}`);
  });
});

afterAll(async () => {
  log.close();
});

describe('End-to-end tests', () => {
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
    const api = new API(
      log, serverURL, password,
    );

    const urlPromises = Array(10).fill(0).map(() => api.getUrlToCrawl());
    const urls = await Promise.all(urlPromises);
    const set = new Set(urls);
    expect(set.size).toBe(10);
  });
});

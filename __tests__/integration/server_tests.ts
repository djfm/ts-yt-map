import { loadServerConfig, ServerConfig, createLogger, LoggerInterface } from '../../src/lib';
import { startServer, ServerHandle } from '../../src/lib/server';
import { API } from '../../src/lib/api';
import { Client } from '../../src/lib/client';

const password = 'secret';
let cfg: ServerConfig;
let server: ServerHandle;
let serverURL: string;
let client: Client;
let log: LoggerInterface;

jest.setTimeout(300000);

beforeAll(async () => {
  cfg = await loadServerConfig(password);
  serverURL = `http://localhost:${cfg.port}`;
  log = await createLogger();
  const api = new API(log, serverURL, password);
  client = new Client(log, api);
  server = await startServer(cfg, log);
  log.info('Removing all recommendations from server before tests...');
  await server.pg.query('TRUNCATE TABLE recommendation');
  await server.pg.query('DELETE FROM video');
  await server.pg.query('DELETE FROM channel');
});

afterAll(async () => {
  if (server) {
    await server.close();
  }

  log.close();
});

describe('the server abasic behaviour', () => {
  it('should get a URL to crawl from the server', async () => {
    const api = new API(
      log, serverURL, password,
    );

    const url = await api.getUrlToCrawl();
    expect(url.length).toBeGreaterThan(0);
  });

  it('should scrape one video and its recommendations', async () => {
    server.testing.resetTimeSinceLastURLToCrawlSent();

    const resp = await client.scrapeOneVideoAndItsRecommendations();
    expect(resp.ok).toBe(true);
    expect(resp.count).toBe(10);
  });

  xit('should get 10 different URLs to crawl', async () => {
    const api = new API(
      log, serverURL, password,
    );

    const urls = await Promise.all(Array.from({ length: 10 }, () => api.getUrlToCrawl()));
    const set = new Set(urls);

    expect(set.size).toBe(10);
  });
});

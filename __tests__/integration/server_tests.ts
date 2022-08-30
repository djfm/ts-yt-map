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
let api: API;

jest.setTimeout(300000);

beforeAll(async () => {
  cfg = await loadServerConfig(password);
  serverURL = `http://localhost:${cfg.port}`;
  log = await createLogger();
  api = new API(log, serverURL, password);
  client = new Client(log, api);
  server = await startServer(cfg, log);
  log.info('Removing all recommendations from server before tests...');
  const res = await api.forTestingClearDb();
  res.queries.forEach((q) => log.info(q));
});

afterAll(async () => {
  if (server) {
    await server.close();
  }

  log.close();
});

describe('the server basic behaviour', () => {
  it('should get a URL to crawl from the server', async () => {
    const url = await api.getUrlToCrawl();
    expect(url.length).toBeGreaterThan(0);
  });

  it('should scrape one video and its recommendations', async () => {
    api.forTestingResetTiming();

    const resp = await client.scrapeOneVideoAndItsRecommendations();
    expect(resp.ok).toBe(true);
    expect(resp.count).toBe(10);
  });
});

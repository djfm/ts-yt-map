import { loadServerConfig, ServerConfig, createLogger, LoggerInterface } from '../../lib';
import { startServer, ServerHandle } from '../../lib/server';
import { API } from '../../lib/api';
import Client from '../../lib/client';

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
  api.createClient({
    name: 'test',
    seed: 'https://www.youtube.com/watch?v=HqsIOTEbriY',
    ip: await api.getIP(),
    city: 'test',
    country: 'TE',
  });
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

describe.only('the server basic behaviour', () => {
  it('should get its IP', async () => {
    const ip = await api.getIP();
    log.info(ip);
    expect(ip.length).toBeGreaterThan(0);
  });

  it('should get a URL to crawl from the server', async () => {
    const url = await api.getUrlToCrawl();
    expect(url.length).toBeGreaterThan(0);
  });

  it('should scrape one video and its recommendations', async () => {
    const resp = await client.scrapeOneVideoAndItsRecommendations();
    expect(resp.ok).toBe(true);
    expect(resp.count).toBe(10);
  });
});

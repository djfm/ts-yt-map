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

beforeEach(async () => {
  cfg = await loadServerConfig(password);
  serverURL = `http://localhost:${cfg.port}`;
  log = await createLogger();
  const api = new API(log, serverURL, password);
  client = new Client(log, api);
  server = await startServer(cfg, log);
  log.info('Removing all recommendations from server before tests...');
  await server.pg.query('TRUNCATE TABLE recommendation');
});

afterEach(async () => {
  if (server) {
    await server.close();
  }

  log.close();
});

describe('Test that the server starts', () => {
  it('should get a URL to crawl from the server', async () => {
    const api = new API(
      log, serverURL, password,
    );

    const url = await api.getUrlToCrawl();
    expect(url.length).toBeGreaterThan(0);
  });

  it('should scrape one video and its recommendations', async () => {
    const resp = await client.scrapeOneVideoAndItsRecommendations();
    expect(resp.ok).toBe(true);
  });
});

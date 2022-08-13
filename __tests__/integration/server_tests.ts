import fetch from 'node-fetch';

import { loadServerConfig, ServerConfig } from '../../src/lib';
import { startServer, ServerHandle } from '../../src/lib/server';
import { MockLogger } from '../../src/util';
import { Client } from '../../src/lib/api';

const password = 'secret';
let cfg: ServerConfig;
let server: ServerHandle;
const log = new MockLogger();

beforeAll(async () => {
  cfg = await loadServerConfig(password);
});

afterAll(async () => {
  if (server) {
    await server.close();
  }

  log.close();
});

describe('Test that the server starts', () => {
  it('should start the server', async () => {
    server = await startServer(cfg, log);
  });

  it('should get a URL to crawl from the server', async () => {
    const api = new Client(
      log, `http://localhost:${cfg.port}`, password,
    );

    const url = await api.getUrlToCrawl();
    expect(url.length).toBeGreaterThan(0);
  });
});

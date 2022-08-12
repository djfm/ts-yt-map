import fetch from 'node-fetch';

import { loadServerConfig, ServerConfig } from '../../src/lib';
import { startServer, ServerHandle } from '../../src/lib/server';
import { MockLogger } from '../../src/util';

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
    const resp = await fetch(`http://localhost:${cfg.port}/video/get-url-to-crawl`, {
      method: 'POST',
      headers: {
        'x-password': password,
      },
    });

    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(json).toHaveProperty('url');
  });
});

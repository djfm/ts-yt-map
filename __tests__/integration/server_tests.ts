import { loadServerConfig, ServerConfig, log } from '../../src/lib';
import { startServer, ServerHandle } from '../../src/lib/server';

const password = 'secret';
let cfg: ServerConfig;
let server: ServerHandle;

jest.setTimeout(600000);

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
        'X-Password': password,
      },
    });

    expect(resp.status).toBe(200);
    const json = await resp.json();
    expect(json.url).toBeDefined();
  });
});

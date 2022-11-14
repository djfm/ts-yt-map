import { readFile } from 'fs/promises';

import { loadConfig, createLogger } from '../lib';
import { API } from '../lib/api';
import { ClientSettings } from '../lib/client';
import { CreateProjectPayload } from '../models/project';
import { question, isFile } from '../util';

const server = process.argv[2];
const password = process.argv[3];
const urlsPath = process.argv[4];

const usage = () => {
  // eslint-disable-next-line no-console
  console.error('Usage: createProject <server> <password> <urls file: text file with one URL per line and no header>');
  process.exit(1);
};

if (typeof server !== 'string' || typeof password !== 'string' || typeof urlsPath !== 'string') {
  usage();
}

// eslint-disable-next-line no-console
console.log('Server:', server);
// eslint-disable-next-line no-console
console.log('Password:', password);

const loadURLs = async (path: string): Promise<string[]> => {
  const data = await readFile(path, 'utf8');
  const lines = data.split('\n').filter((line) => line.length > 0);

  for (const line of lines) {
    try {
      // eslint-disable-next-line no-new
      new URL(line);
    } catch (e) {
      throw new Error(`Invalid URL: ${line}`);
    }
  }

  return lines;
};

const main = async () => {
  if (!await isFile(urlsPath)) {
    // eslint-disable-next-line no-console
    console.error(`File ${urlsPath} does not exist`);
    process.exit(1);
  }

  const log = await createLogger();

  // just remove a warning, we don't care about it
  process.env.node_env = 'production';
  const cfg = await loadConfig(password);

  const clientSettings = new ClientSettings(cfg.client_name, cfg.seed_video, -1);
  const api = new API(log, server, password, clientSettings);

  const payload = new CreateProjectPayload();

  payload.name = await question('Project name: ');
  payload.description = await question('Project description: ');
  payload.urls = await loadURLs(urlsPath);

  const project = await api.createProject(payload);

  // eslint-disable-next-line no-console
  console.log('Successfully created project', project);
};

main().then(() => { process.exit(0); }, async (err) => {
  const log = await createLogger();
  log.error(err.message);
  log.error(err.stack);
  process.exit(1);
});

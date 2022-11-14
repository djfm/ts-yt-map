import { loadConfig, createLogger } from '../lib';
import { API } from '../lib/api';
import { ClientSettings } from '../lib/client';
import { CreateProjectPayload } from '../models/project';

const server = process.argv[2];
const password = process.argv[3];

if (typeof server !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Usage: createProject <server> <password>');
  process.exit(1);
}

if (typeof password !== 'string') {
  // eslint-disable-next-line no-console
  console.error('Usage: createProject <server> <password>');
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log('Server:', server);
// eslint-disable-next-line no-console
console.log('Password:', password);

const main = async () => {
  const log = await createLogger();
  const cfg = await loadConfig(password);

  const clientSettings = new ClientSettings(cfg.client_name, cfg.seed_video, -1);
  const api = new API(log, server, password, clientSettings);

  const payload = new CreateProjectPayload();

  payload.name = 'test project name';
  payload.description = 'test project description';
  payload.urls = ['https://www.youtube.com/watch?v=9bZkp7q19f0', 'test url 2'];

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

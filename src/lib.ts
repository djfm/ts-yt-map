import { join } from 'path';
import { readFile } from 'fs/promises';

import { parse as parseYAML } from 'yaml';
import { validate, Length, Min, Max } from 'class-validator';
import { ChromeConfig } from './browser';
// eslint-disable-next-line
import { Logger, FileTransport, ConsoleTransport } from '../vendor/loggah/src';

export {
  Browser,
} from './browser';

class DbConfig {
  @Length(1, 255)
  public host = '';

  @Min(1)
  @Max(65535)
  public port = 0;

  @Length(1, 255)
  public username = '';

  @Length(1, 255)
  public password = '';

  @Length(1, 255)
  public database = '';
}

export class ServerConfig {
  @Length(1, 255)
  public password: string = '';

  @Min(1)
  @Max(65535)
  public port = 0;

  @Length(1, 255)
  public host:string = '';

  public db = new DbConfig();

  @Length(1, 255)
  public seed_video = '';

  constructor(config: Record<string, unknown>) {
    Object.assign(this, config);
  }
}

const logDir = new Date().toISOString();

export const createLogger = async (): Promise<Logger> => {
  const logRoot = join(__dirname, '..', 'logs', logDir);
  const log = new Logger();
  log.addTransport(new ConsoleTransport());
  log.addTransport(new FileTransport(join(logRoot, 'combined.log')));
  return log;
};

export const loadChromeConfig = async (): Promise<ChromeConfig> => {
  const configPath = join(__dirname, '..', 'config', 'chrome.yaml');
  const config = parseYAML(await readFile(configPath, 'utf8'));
  const chromeConfig = new ChromeConfig(config);
  await validate(chromeConfig);
  return chromeConfig;
};

const getServerConfigFileName = async (): Promise<string> => {
  if (process.env.NODE_ENV === 'production') {
    return 'production.yaml';
  }

  if (process.env.NODE_ENV === 'test-docker') {
    return 'test-docker.yaml';
  }

  if (process.env.NODE_ENV === 'production-docker') {
    return 'production-docker.yaml';
  }

  if (process.env.NODE_ENV !== 'test') {
    const log = await createLogger();
    log.error('Unknown NODE_ENV, defaulting to test.yaml');
    log.close();
  }

  return 'test.yaml';
};

export const loadServerConfig = async (serverPassword: string): Promise<ServerConfig> => {
  const fname = await getServerConfigFileName();

  const configPath = join(__dirname, '..', 'config', fname);
  const config = parseYAML(await readFile(configPath, 'utf8'));
  config.password = serverPassword;
  const serverConfig = new ServerConfig(config);

  return serverConfig;
};

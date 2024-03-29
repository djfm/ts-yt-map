import { join } from 'path';
import { readFile, mkdir } from 'fs/promises';

import pino from 'pino';

import { parse as parseYAML } from 'yaml';
import { validate, Length, Min, Max } from 'class-validator';
import { ChromeConfig } from './browser';

export {
  Browser,
} from './browser';

export interface LogMethod {
  (message: string, ...meta: unknown[]): unknown;
  (message: unknown): unknown;
  (infoObject: object): unknown;
}

export interface LoggerInterface {
  error: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  close: () => void;
  getRootDirectory(): string;
}

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

  @Length(1, 255)
  public client_name: string = 'unspecified client';

  constructor(config: Record<string, unknown>) {
    Object.assign(this, config);
  }
}

const logDir = new Date().toISOString().replace(':', '.');

export const createLogger = async (): Promise<LoggerInterface> => {
  const logRoot = join(__dirname, '..', 'logs', logDir);
  await mkdir(logRoot, { recursive: true });

  const logger = pino();

  logger.level = 'debug';

  return Object.assign(logger, {
    getRootDirectory: () => logRoot,
    close: () => null,
  });
};

export const loadChromeConfig = async (): Promise<ChromeConfig> => {
  const configPath = join(__dirname, '..', 'config', 'chrome.yaml');
  const config = parseYAML(await readFile(configPath, 'utf8'));
  const chromeConfig = new ChromeConfig(config);
  await validate(chromeConfig);
  return chromeConfig;
};

const getServerConfigFileName = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return 'production.yaml';
  }

  if (process.env.NODE_ENV === 'test-docker') {
    return 'test-docker.yaml';
  }

  if (process.env.NODE_ENV === 'production-docker') {
    return 'production-docker.yaml';
  }

  if (process.env.NODE_ENV === 'integration') {
    return 'integration.yaml';
  }

  if (process.env.NODE_ENV === 'integration-docker') {
    return 'integration-docker.yaml';
  }

  return 'test.yaml';
};

export const loadConfig = async (
  serverPassword: string | undefined = process.env.SERVER_PASSWORD,
): Promise<ServerConfig> => {
  const fname = getServerConfigFileName();
  const log = await createLogger();

  if (!serverPassword) {
    log.error('No server password provided');
    process.exit(1);
  }

  if (process.env.NODE_ENV !== 'test' && fname === 'test.yaml') {
    log.error(`Loading config from ${fname} by default. This may be a mistake.`);
  }

  // log.info(`Loading server config from ${fname}`);
  const configPath = join(__dirname, '..', 'config', fname);
  const config = parseYAML(await readFile(configPath, 'utf8'));
  config.password = serverPassword;
  const serverConfig = new ServerConfig(config);
  // log.info(JSON.stringify(serverConfig, null, 2));

  log.close();

  return serverConfig;
};

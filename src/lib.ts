import { join } from 'path';
import { mkdirSync } from 'fs';
import { readFile } from 'fs/promises';

import { parse as parseYAML } from 'yaml';
import winston, { format } from 'winston';
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
}

/**
 * Available log levels.
 *
 *  const levels = {
 *    error: 0, // most serious
 *    warn: 1,
 *    info: 2,
 *    http: 3,
 *    verbose: 4,
 *    debug: 5,
 *    silly: 6 // least serious
 *  };
 */

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

  public db = new DbConfig();

  @Length(1, 255)
  public seed_video = '';

  constructor(config: Record<string, unknown>) {
    Object.assign(this, config);
  }
}

const { colorize, combine, timestamp, label, prettyPrint, json } = format;

const logDir = new Date().toISOString();
export const logRoot = join(__dirname, '..', 'logs', logDir);

mkdirSync(logRoot, { recursive: true });

export const log = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'ts_yt_map' }),
    timestamp(),
    prettyPrint(),
    json(),
  ),
  defaultMeta: { service: 'ts_yt_map' },
  transports:
    ['error', 'combined'].map((level) => (
      new winston.transports.File({
        filename: `${logRoot}/${level}.log`, level: level === 'combined' ? undefined : level,
      })
    )),
});

const consoleFormat = format.printf((msg) => `${msg.level.padEnd(17)} [${msg.label}] [${msg.timestamp}] :: ${msg.message}`);

if (process.env.LOG === 'show') {
  log.add(new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      consoleFormat,
    ),
    level: 'debug',
  }));
}

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

  return 'test.yaml';
};

export const loadServerConfig = async (serverPassword: string): Promise<ServerConfig> => {
  const fname = getServerConfigFileName();

  log.info(`Loading server config from ${fname}`);

  const configPath = join(__dirname, '..', 'config', fname);
  const config = parseYAML(await readFile(configPath, 'utf8'));
  config.password = serverPassword;
  const serverConfig = new ServerConfig(config);

  return serverConfig;
};

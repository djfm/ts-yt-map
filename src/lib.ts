import { join } from 'path';
import { mkdirSync, readFileSync } from 'fs';

import { parse as parseYAML } from 'yaml';
import winston, { format } from 'winston';
import { ChromeConfig } from './browser';

export {
  Browser,
} from './browser';

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

export interface AppConfig {
  chrome: ChromeConfig,
  server: {
    port: number,
    db: {
      host: string,
      port: number,
      username: string,
      password: string,
      database: string,
    }
  }
}

export const loadConfig = (): AppConfig => {
  const configPath = join(__dirname, '..', 'config', 'default.yaml');
  const configSource = readFileSync(configPath).toString();
  const config = parseYAML(configSource);
  // TODO: Validate the config!
  return config as AppConfig;
};

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
  transports: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly', 'combined'].map((level) => (
    new winston.transports.File({ filename: `${logRoot}/${level}.log`, level: level === 'combined' ? undefined : level })
  )),
});

const consoleFormat = format.printf((msg) => `${msg.level.padEnd(17)} [${msg.label}] [${msg.timestamp}] :: ${msg.message}`);

if (process.env.NODE_ENV !== 'production') {
  log.add(new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      consoleFormat,
    ),
    level: 'debug',
  }));
}

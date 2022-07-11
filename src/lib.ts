import winston, { format } from 'winston';
import { ChromeConfig } from './browser';
import config from '../config/default.json';

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
}

// TODO: Validate it
export const loadConfig = (): AppConfig =>
  config as AppConfig;

const { combine, colorize, timestamp, label, prettyPrint, json } = format;

export const log = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    label({ label: 'ts_yt_map' }),
    timestamp(),
    prettyPrint(),
    json(),
  ),
  defaultMeta: { service: 'ts_yt_map' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    new winston.transports.File({ filename: 'logs/http.log', level: 'http' }),
    new winston.transports.File({ filename: 'logs/verbose.log', level: 'verbose' }),
    new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    new winston.transports.File({ filename: 'logs/silly.log', level: 'silly' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  log.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

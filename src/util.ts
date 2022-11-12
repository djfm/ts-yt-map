import { LoggerInterface } from './lib';

/* eslint-disable import/prefer-default-export */
export const convertNumber = (str: string): number => {
  const expanded = str.replace(/,/g, '');

  if (expanded.endsWith('K')) {
    return Math.round(+expanded.slice(0, -1) * 1000);
  }

  if (expanded.endsWith('M')) {
    return Math.round(+expanded.slice(0, -1) * 1000000);
  }

  return Math.round(+expanded);
};

export const has = (obj: unknown, key: string): obj is Record<string, unknown> =>
  Object.prototype.hasOwnProperty.call(obj, key);

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => { setTimeout(resolve, ms); });

export class MockLogger implements LoggerInterface {
  error(message: string, ...meta: unknown[]): void

  error(message: unknown): unknown

  error(): unknown {
    return undefined;
  }

  info(message: string, ...meta: unknown[]): void

  info(message: unknown): unknown

  info(): unknown {
    return undefined;
  }

  debug(message: string, ...meta: unknown[]): void

  debug(message: unknown): unknown

  debug(): unknown {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close(): void {}

  getRootDirectory(): string {
    return '/tmp';
  }
}

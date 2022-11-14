import readline from 'readline';
import { stat } from 'fs/promises';

import { LoggerInterface } from './lib';

const locks = new Map<string, Array<() => Promise<void>>>();

const unstackLock = async (id: string) => {
  const stack = locks.get(id);

  if (!stack) {
    return;
  }

  const nextFn = stack.shift();

  if (!nextFn) {
    return;
  }

  try {
    await nextFn();
  } finally {
    await unstackLock(id);
  }
};

export const withLock = async (id: string, fn: () => Promise<void>): Promise<void> => {
  if (!locks.has(id)) {
    locks.set(id, []);
  }

  const lock = locks.get(id);

  if (!lock) {
    throw new Error('Lock is not defined');
  }

  lock.push(fn);

  await unstackLock(id);
};

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

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => { setTimeout(resolve, ms); });

export const question = async (prompt: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

export const isFile = async (path: string): Promise<boolean> => {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (e) {
    return false;
  }
};

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

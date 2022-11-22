import readline from 'readline';
import { stat } from 'fs/promises';

import { LoggerInterface } from './lib';

type AsyncFn = () => Promise<void>;

type Lock = {
  running: Promise<void> | null;
  queue: AsyncFn[];
}

const locks = new Map<string, Lock>();

const unstackLock = async (id: string) => {
  const stack = locks.get(id);

  if (!stack) {
    return;
  }

  if (stack.queue.length === 0) {
    return;
  }

  if (!stack.running) {
    const fn = stack.queue.shift();
    if (fn) {
      stack.running = fn();
      await stack.running;
      stack.running = null;
      await unstackLock(id);
      const newStack = locks.get(id);
      if (newStack && newStack.queue.length === 0) {
        locks.delete(id);
      }
    }
  }
};

export const withLock = async (id: string, fn: AsyncFn): Promise<void> => {
  if (!locks.has(id)) {
    locks.set(id, { running: null, queue: [] });
  }

  const lock = locks.get(id);

  if (!lock) {
    // never happens but makes TS happy
    throw new Error('Lock is not defined');
  }

  lock.queue.push(fn);

  return unstackLock(id);
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

import { withLock, sleep } from '../../util';

describe('the "withLock" function', () => {
  it('allows to run sequentially parallel requests', async () => {
    const results: number[] = [];

    const f1 = withLock('lock', async () => {
      await sleep(Math.random() * 100);
      results.push(1);
    });

    const f2 = withLock('lock', async () => {
      await sleep(Math.random() * 100);
      results.push(2);
    });

    const f3 = withLock('lock', async () => {
      await sleep(Math.random() * 100);
      results.push(3);
    });

    await Promise.all([f1, f2, f3]);

    expect(results).toEqual([1, 2, 3]);
  });
});

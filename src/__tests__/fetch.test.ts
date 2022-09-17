import Fetch from '../fetch';

describe('The Fetch class', () => {
  it('determines the correct protocol', () => {
    const a = new URL('https://www.google.com');
    expect(a.protocol).toBe('https:');

    const b = new URL('http://example.com');
    expect(b.protocol).toBe('http:');
  });

  it('Should fetch the https google home-page', async () => {
    const f = new Fetch('https://google.fr');
    const ok = await f.ok();
    expect(ok).toBe(true);
  });

  it('Should fetch an https ipv4 site', async () => {
    const f = new Fetch('https://ipv4.fmdj.fr');
    await f.ok();
    expect(f.statusCode()).toBe(200);
  });
});

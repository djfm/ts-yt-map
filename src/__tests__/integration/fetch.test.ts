import Fetch from '../../fetch';

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
    const f = new Fetch('https://ipv4.fmdj.fr').setFamily(4);
    await f.ok();
    expect(f.statusCode()).toBe(200);
  });

  it('should get the text from an http ipv6 site', async () => {
    const f = new Fetch('http://ipv6.fmdj.fr').setFamily(6);
    await f.ok();
    expect(f.text().trim()).toBe('lappy 1');
  });

  it('should get the text from an ssl ipv6 website', async () => {
    const f = new Fetch('https://ssl.ipv6.fmdj.fr').setFamily(6);
    await f.ok();
    expect(f.text().trim()).toBe('lappy 2');
  });
});

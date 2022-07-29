import URL from 'url';
import { Page, Browser as PuppeteerBrowser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export interface ChromeConfig {
  headless: boolean;
  proxy_uri: string | false;
  viewport_width: undefined | number;
  viewport_height: undefined | number;
}

// This is experimental and not used as of now,
// because it makes scraping channels fail.
export const blockUselessRequests = async (page: Page): Promise<void> => {
  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (request.url().startsWith('https://www.youtube.com/api/')) {
      request.abort();
      return;
    }

    if (request.url().endsWith('/ad_status.js')) {
      request.abort();
      return;
    }

    if (request.method() === 'POST') {
      if (request.url() === 'https://www.youtube.com/upgrade_visitor_cookie?eom=1') {
        request.continue();
        return;
      }

      request.abort();
      return;
    }

    const u = URL.parse(request.url());

    if (u.hostname !== 'www.youtube.com' && u.hostname !== 'consent.youtube.com') {
      request.abort();
      return;
    }

    request.continue();
  });
};

export class Browser {
  constructor(private browser: PuppeteerBrowser) {

  }

  static async launch(cfg: ChromeConfig): Promise<Browser> {
    const args = [];

    if (cfg.proxy_uri) {
      args.push(`--proxy-server=${cfg.proxy_uri}`);
    }

    // for docker, running as root requires this
    if (process.env.UID === undefined) {
      args.push('--no-sandbox', '--disable-setuid-sandbox');
    }

    const defaultViewport = {
      width: cfg.viewport_width ?? 1980 + Math.round(Math.random() * 100),
      height: cfg.viewport_height ?? 1980 + Math.round(Math.random() * 100),
    };

    const puppeteerBrowser = await puppeteer.launch({
      headless: cfg.headless ?? false,
      defaultViewport,
      args,
    });

    return new Browser(puppeteerBrowser);
  }

  public async close() {
    await this.browser.close();
  }

  public async newPage(): Promise<Page> {
    const page = await this.browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(30000);

    // await blockUselessRequests(page);

    return page;
  }
}

export default Browser;

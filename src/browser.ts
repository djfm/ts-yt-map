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

    const browser = new Browser(puppeteerBrowser);

    return browser;
  }

  public async close() {
    await this.browser.close();
  }

  public async newPage(): Promise<Page> {
    const page = await this.browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(30000);
    return page;
  }
}

export default Browser;

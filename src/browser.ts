import { Page, Browser as PuppeteerBrowser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export interface ChromeConfig {
  headless: boolean;
  proxy_uri: string | false;
}

export class Browser {
  constructor(private browser: PuppeteerBrowser) {

  }

  static async launch(cfg: ChromeConfig): Promise<Browser> {
    const args = [];

    if (cfg.proxy_uri) {
      args.push(`--proxy-server=${cfg.proxy_uri}`);
    }

    const puppeteerBrowser = await puppeteer.launch({
      headless: cfg.headless,
      defaultViewport: {
        width: 1980 + Math.round(Math.random() * 100),
        height: 1080 * 2 + Math.round((Math.random() * 500)),
      },
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

    return page;
  }
}

export default Browser;

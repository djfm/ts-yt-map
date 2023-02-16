import { Page, Browser as PuppeteerBrowser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export class ChromeConfig {
  headless: boolean = true;

  proxy_uri: string | false = false;

  constructor(data: Record<string, unknown>) {
    Object.assign(this, data);
  }
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
      width: 1980 + Math.round(Math.random() * 100),
      height: 1980 + Math.round(Math.random() * 100),
    };

    const puppeteerBrowser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
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

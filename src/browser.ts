import { Page, Browser as PuppeteerBrowser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

class Browser {
  constructor(private browser: PuppeteerBrowser) {

  }

  static async launch(): Promise<Browser> {
    const puppeteerBrowser = await puppeteer.launch({
      headless: true,
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

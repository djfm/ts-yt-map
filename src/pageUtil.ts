import { Page, ElementHandle } from 'puppeteer';
import { LoggerInterface } from './lib';
import { sleep } from './util';

export class PageUtil {
  private waitDelay: number = 5000;

  constructor(
    private readonly log: LoggerInterface,
    private readonly page: Page,
  ) {}

  setWaitDelay = (ms: number): PageUtil => {
    this.waitDelay = ms;
    return this;
  };

  getWaitDelay = (): number => this.waitDelay;

  navigateTo = async (url: string) => {
    this.log.debug(`Navigating to URL: ${url}`);
    await this.page.goto(url);
    await sleep(this.waitDelay);
  };

  acceptCookiesIfAny = async (): Promise<boolean> => {
    this.log.debug('Trying to accept cookies if any...');
    let elt;
    try {
      elt = await this.page.waitForSelector(
        '.eom-button-row ytd-button-renderer.style-primary:last-of-type, [aria-label*="Accept"]',
      );
    } catch (e) {
      this.log.debug('No cookies to accept');
      return true;
    }

    if (!elt) {
      this.log.debug('No cookies were found');
      return false;
    }

    await elt.click();
    await sleep(this.waitDelay);

    this.log.debug('Cookies were clicked');

    return true;
  };

  takeScreenshot = async (prefix: string): Promise<void> => {
    const url = this.page.url().split('?')[0].split('/').slice(1).join('_');
    const path = `${this.log.getRootDirectory()}/screenshot_${prefix}_${url}_${new Date().toISOString()}.png`;
    await this.page.screenshot({ path });
  };

  tryToGetInnerText = async (
    selector: string, remainingAttempts: number,
  ): Promise<string> => {
    const res = await this.page.evaluate((s: string) => {
      const elt = document.querySelector(s);
      if (!elt) {
        return null;
      }
      return elt.textContent?.trim();
    }, selector);

    if (!res) {
      if (remainingAttempts > 0) {
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, this.waitDelay));
        return this.tryToGetInnerText(selector, remainingAttempts - 1);
      }

      throw new Error(`Could not get inner text for selector: '${selector}'`);
    }

    return res;
  };

  getInnerText = async (selector: string): Promise<string> => {
    this.log.debug(`Getting inner text for selector: '${selector}'`);

    return this.tryToGetInnerText(selector, 2);
  };

  findAllElementHandles = async (selector: string): Promise<ElementHandle[]> => {
    const eltHandles = await this.page.$$(selector);
    return eltHandles;
  };

  getAttribute = async (
    selector: string, attribute: string,
  ): Promise<string> => {
    this.log.debug(`Getting attribute '${attribute}' for selector: '${selector}'`);

    const eltHandle = await this.page.waitForSelector(selector);

    if (!eltHandle) {
      throw new Error(`Could not get attribute '${
        attribute
      }' for selector: '${
        selector
      }' - element handle not found`);
    }

    const elt = eltHandle.asElement();

    if (!elt) {
      throw new Error(
        `Could not get attribute ${
          attribute
        } for selector ${
          selector
        }: could not get element from handle.'${
          selector
        }`,
      );
    }

    const rawAttr = (await elt.getProperty(attribute)).toString();

    const attr = decodeURI(rawAttr.split('JSHandle:')[1]);

    return attr;
  };

  getElementAttribute = async (elt: ElementHandle, attribute: string): Promise<string> => {
    const handle = elt.asElement();

    if (handle === null) {
      throw new Error(`Could not get attribute '${attribute}' for element: '${elt}'`);
    }

    return (await handle.getProperty(attribute)).toString();
  };

  getElementsAttribute = async (
    selector: string, attribute: string,
  ): Promise<string[]> => {
    this.log.debug(`Getting attribute '${attribute}' for all elements matching selector: '${selector}'`);

    const handles = await this.findAllElementHandles(selector);
    const values = await Promise.all(handles.map((h) => this.getElementAttribute(h, attribute)));
    return values;
  };

  findElementHandle = (selector: string): Promise<ElementHandle | null> => {
    this.log.debug(`Finding all elements matching selector: '${selector}'`);

    return this.page.$(selector);
  };
}

export default PageUtil;

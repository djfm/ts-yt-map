import { Page, ElementHandle } from 'puppeteer';
import { log, logRoot } from './lib';

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const navigateTo = async (page: Page, url: string): Promise<void> => {
  log.debug(`Navigating to URL: ${url}`);
  await page.goto(url);

  try {
    /*
    let count = 0;
    await page.waitForRequest((req) => {
      count += 1;
      return count > 5;
    });
    */

    // await page.waitForSelector('#logo-icon');

    /*
    await page.waitForNetworkIdle({
      timeout: 20000,
      idleTime: 500,
    });
    */

    await sleep(5000);
  } catch (e) {
    log.warn(`Failed to wait for network idle: ${url}`, { error: e });
  }
};

export const acceptCookiesIfAny = async (page: Page): Promise<boolean> => {
  log.debug('Trying to accept cookies if any...');
  const elt = await page.waitForSelector(
    '.eom-button-row ytd-button-renderer.style-primary:last-of-type, [aria-label*="Accept"]',
  );

  if (!elt) {
    log.debug('No cookies were found');
    return false;
  }

  await elt.click();
  // await page.waitForSelector('#logo-icon');

  /*
  await page.waitForNavigation();
  await page.waitForNetworkIdle();
  */

  await sleep(5000);

  log.debug('Cookies were clicked');

  return true;
};

export const takeScreenshot = async (page: Page, prefix: string): Promise<void> => {
  const url = page.url().split('?')[0].split('/').slice(1).join('_');
  const path = `${logRoot}/screenshot_${prefix}_${url}_${new Date().toISOString()}.png`;
  await page.screenshot({ path });
};

const tryToGetInnerText = async (
  page: Page, selector: string, remainingAttempts: number,
): Promise<string> => {
  const res = await page.evaluate((s: string) => {
    const elt = document.querySelector(s);
    if (!elt) {
      return null;
    }
    return elt.textContent?.trim();
  }, selector);

  if (!res) {
    if (remainingAttempts > 0) {
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return tryToGetInnerText(page, selector, remainingAttempts - 1);
    }

    throw new Error(`Could not get inner text for selector: '${selector}'`);
  }

  return res;
};

export const getInnerText = async (page: Page, selector: string): Promise<string> => {
  log.debug(`Getting inner text for selector: '${selector}'`);

  return tryToGetInnerText(page, selector, 2);
};

/*
export const optionally_click_element = async (page: Page, selector: string): Promise<boolean> => {
  page.waitForSelector(selector);
};
*/

export const getAttribute = async (
  page: Page, selector: string, attribute: string,
): Promise<string> => {
  log.debug(`Getting attribute '${attribute}' for selector: '${selector}'`);

  const eltHandle = await page.waitForSelector(selector);

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

const findAllElementHandles = async (page: Page, selector: string): Promise<ElementHandle[]> => {
  const eltHandles = await page.$$(selector);
  return eltHandles;
};

const getElementAttribute = async (elt: ElementHandle, attribute: string): Promise<string> => {
  const handle = elt.asElement();

  if (handle === null) {
    throw new Error(`Could not get attribute '${attribute}' for element: '${elt}'`);
  }

  return (await handle.getProperty(attribute)).toString();
};

export const getElementsAttribute = async (
  page: Page, selector: string, attribute: string,
): Promise<string[]> => {
  log.debug(`Getting attribute '${attribute}' for all elements matching selector: '${selector}'`);

  const handles = await findAllElementHandles(page, selector);
  const values = await Promise.all(handles.map((h) => getElementAttribute(h, attribute)));
  return values;
};

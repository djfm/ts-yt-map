import { Page } from 'puppeteer';

export const acceptCookiesIfAny = async (page: Page): Promise<boolean> => {
  const elt = await page.waitForSelector(
    '.eom-button-row ytd-button-renderer.style-primary:last-of-type',
  );

  if (!elt) {
    return false;
  }

  await elt.click();
  return true;
};

export const getInnerText = async (page: Page, selector: string): Promise<string> => {
  const res = await page.evaluate((s: string) => {
    const elt = document.querySelector(s);
    if (!elt) {
      return null;
    }
    return elt.textContent;
  }, selector);

  if (res === null) {
    throw new Error(`Could not get inner text for selector: ${selector}`);
  }

  return res;
};

/*
export const optionally_click_element = async (page: Page, selector: string): Promise<boolean> => {
  page.waitForSelector(selector);
};
*/

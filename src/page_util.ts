import { Page } from 'puppeteer';

export const accept_cookies_if_any = async (page: Page): Promise<boolean> =>  {
  // await page.waitForNavigation();

  let elt = await page.waitForSelector(
    ".eom-button-row ytd-button-renderer.style-primary:last-of-type"
  );

  if (!elt) {
    return false;
  }

  await elt.click();
  return true;
};

export const get_inner_text = async (page: Page, selector: string): Promise<string> => {
  let res = await page.evaluate((selector: string) => {
    let elt = document.querySelector(selector);
    if (!elt) {
      return "";
    }
    return elt.textContent;
  }, selector);

  if (res === null) {
    throw new Error("Could not get inner text for selector: " + selector);
  }

  return res;
};

/*
export const optionally_click_element = async (page: Page, selector: string): Promise<boolean> => {
  page.waitForSelector(selector);
};
*/

import Browser from '../browser';
import { loadConfig } from '../lib';

const start = async (): Promise<Browser> => {
  const cfg = loadConfig();
  cfg.chrome.headless = false;
  const browser = await Browser.launch(cfg.chrome);

  /*
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    // eslint-disable-next-line no-console
    console.log(request.method(), request.url(), request.headers());
    if (request.method() === 'POST') {
      // request.abort();
      request.continue();
    }
  });

  page.on('response', (response) => {
    // eslint-disable-next-line no-console
    console.log(response.status(), response.url(), response.headers());
  });
  */

  return browser;
};

function main() {
  start().then(() => {
    // eslint-disable-next-line no-console
    console.log('done');
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
}

main();

import { Page } from 'puppeteer';
import Browser from '../browser';
import { loadConfig } from '../lib';

const start = async (): Promise<Page> => {
  const cfg = loadConfig();

  cfg.chrome.headless = false;
  cfg.chrome.viewport_width = 1980;
  cfg.chrome.viewport_height = 1080;

  const browser = await Browser.launch(cfg.chrome);
  const page = await browser.newPage();
  return page;
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

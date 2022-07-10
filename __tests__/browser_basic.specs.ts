import { Page } from 'puppeteer';

import Browser from '../src/browser';
import ScrapedVideoData from '../src/video';

jest.setTimeout(60000);

let browser: Browser;
let page: Page;

beforeEach(async () => {
  browser = await Browser.launch();
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

describe('Basic browser tests', () => {
  it('should scrape a single video', async () => {
    const video = await ScrapedVideoData.scrape(page, 'https://www.youtube.com/watch?v=a1zevmYu1v4');
    expect(video.channelURL).toBe('https://www.youtube.com/c/FrançoisMariedeJouvencel');
    expect(video.title).toBe('Drone over Quiet Lake in the Morning');
    expect(+video.rawLikeCount).toBeGreaterThanOrEqual(1);
    expect(video.description).toBe('Another Bebop2 footage from a while ago.');
  });
});

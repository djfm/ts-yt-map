import { Page } from 'puppeteer';

import Browser from '../../src/browser';
import { loadConfig } from '../../src/lib';
import ScrapedVideoData from '../../src/video';
import ScrapedChannelData, { ChannelType } from '../../src/channel';

jest.setTimeout(60000);

let browser: Browser;
let page: Page;

beforeEach(async () => {
  const cfg = loadConfig('');
  browser = await Browser.launch(cfg.chrome);
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

describe('Basic browser scraping tests', () => {
  it('should scrape a single video', async () => {
    const video = await ScrapedVideoData.scrape(page, 'https://www.youtube.com/watch?v=a1zevmYu1v4');
    expect(video.url).toBe('https://www.youtube.com/watch?v=a1zevmYu1v4');
    expect(video.channelURL).toBe('https://www.youtube.com/c/FrançoisMariedeJouvencel');
    expect(video.title).toBe('Drone over Quiet Lake in the Morning');
    expect(+video.rawLikeCount).toBeGreaterThanOrEqual(1);
    expect(video.description).toBe('Another Bebop2 footage from a while ago.');
    expect(video.recommendationURLs.length).toBeGreaterThanOrEqual(10);

    video.recommendationURLs.forEach((url) => {
      expect(url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
    });
  });

  it('should scrape a single channel', async () => {
    const channel = await ScrapedChannelData.scrape(page, 'https://www.youtube.com/c/FrançoisMariedeJouvencel');

    expect(channel.htmlLang).toBe('en');
    expect(channel.humanName).toBe('François-Marie de Jouvencel');
    expect(channel.shortName).toBe('FrançoisMariedeJouvencel');
    expect(channel.rawSubscriberCount).toMatch(/^\d\s+subscribers?$/);
    expect(channel.description).toBe('[youchoose:15068d5ba5e3b86d1182fbef8d0ae938cb091c63]');
    expect(channel.channelType).toBe(ChannelType.C);
    expect(channel.youtubeId).toBe('UCmHeND0P_fw8BLk8ITNzvHQ');
  });
});

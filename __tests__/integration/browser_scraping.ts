import { Browser } from '../../src/browser';
import { loadChromeConfig, createLogger, LoggerInterface } from '../../src/lib';
import { ChannelType } from '../../src/channel';
import { Scraper } from '../../src/scraper';
import { PageUtil } from '../../src/pageUtil';

jest.setTimeout(600000);

let browser: Browser;
let scraper: Scraper;
let page: PageUtil;
let log: LoggerInterface;

beforeEach(async () => {
  const cfg = await loadChromeConfig();
  browser = await Browser.launch(cfg);
  const browserPage = await browser.newPage();
  log = await createLogger();
  scraper = new Scraper(log);
  page = new PageUtil(log, browserPage);
});

afterEach(async () => {
  await browser.close();
  log.close();
});

describe('Basic browser scraping tests', () => {
  it('should scrape a single video', async () => {
    const video = await scraper.scrapeVideo(page, 'https://www.youtube.com/watch?v=a1zevmYu1v4');
    expect(video.url).toBe('https://www.youtube.com/watch?v=a1zevmYu1v4');
    expect(video.channelURL).toBe('https://www.youtube.com/c/FrançoisMariedeJouvencel');
    expect(video.title).toBe('Drone over Quiet Lake in the Morning');
    expect(+video.rawLikeCount).toBeGreaterThanOrEqual(1);
    expect(+video.rawViewCount.split(' ')[0]).toBeGreaterThanOrEqual(1);
    expect(video.description).toBe('Another Bebop2 footage from a while ago.');
    expect(video.recommendationURLs.length).toBeGreaterThanOrEqual(10);

    video.recommendationURLs.forEach((url) => {
      expect(url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
    });
  });

  it('should scrape a single channel', async () => {
    const channel = await scraper.scrapeChannel(page, 'https://www.youtube.com/c/FrançoisMariedeJouvencel');

    expect(channel.htmlLang).toBe('en');
    expect(channel.humanName).toBe('François-Marie de Jouvencel');
    expect(channel.shortName).toBe('FrançoisMariedeJouvencel');
    expect(channel.rawSubscriberCount).toMatch(/^\d\s+subscribers?$/);
    expect(channel.description).toBe('[youchoose:15068d5ba5e3b86d1182fbef8d0ae938cb091c63]');
    expect(channel.channelType).toBe(ChannelType.C);
    expect(channel.youtubeId).toBe('UCmHeND0P_fw8BLk8ITNzvHQ');
  });
});

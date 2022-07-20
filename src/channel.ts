import { Page } from 'puppeteer';

import { log } from './lib';

import {
  acceptCookiesIfAny,
  getAttribute,
  getInnerText,
  navigateTo,
  takeScreenshot,
} from './page_util';

export enum ChannelType {
  C = '/c/',
  Channel = '/channel/',
  User = '/user/'
}

const asChannelType = (s: string): ChannelType => {
  if (s === 'c') {
    return ChannelType.C;
  }

  if (s === 'channel') {
    return ChannelType.Channel;
  }

  if (s === 'user') {
    return ChannelType.User;
  }

  throw new Error(`Unknown channel type ${s}`);
};

class ScrapedChannelData {
  constructor(
    public channelURL: string,
    public htmlLang: string,
    public channelType: ChannelType,
    public shortName: string,
    public humanName: string,
    public youtubeId: string,
    public rawSubscriberCount: string,
    public description: string,
  ) {}

  public static async scrape(
    page: Page, url: string, acceptCookies = true,
  ): Promise<ScrapedChannelData> {
    log.info(`Scraping channel URL: ${url}`);

    try {
      return await ScrapedChannelData.try_scrape(page, url, acceptCookies);
    } catch (e) {
      log.error(`Failed to scrape channel URL: ${url}`, { error: e });
      await takeScreenshot(page, 'channel_scrape_failure');
      throw e;
    }
  }

  static async try_scrape(
    page: Page, url: string, acceptCookies: boolean,
  ): Promise<ScrapedChannelData> {
    await navigateTo(page, url);

    if (acceptCookies) {
      await acceptCookiesIfAny(page);
    }

    const htmlLang = await getAttribute(page, 'html', 'lang');

    const urlSegments = url.split(/\/+/);
    if (urlSegments.length !== 4) {
      log.error(`Invalid channel URL: ${url}`, { urlSegments });
      throw new Error('Unexpected URL format in channel URL.');
    }

    const shortName = decodeURIComponent(urlSegments[3]);
    const humanName = await getInnerText(page, '#channel-name yt-formatted-string');
    const rawSubscriberCount = await getInnerText(page, '#subscriber-count');

    const youtubeId = (await getAttribute(page, 'link[rel=canonical]', 'href')).split(/\/+/).at(-1);

    if (youtubeId === undefined) {
      throw new Error('Could not find channel youtubeId');
    }

    navigateTo(page, `${url}/about`);
    const description = await getInnerText(page, '#left-column #description');

    const channelType = asChannelType(urlSegments[2]);

    return new ScrapedChannelData(
      url,
      htmlLang,
      channelType,
      shortName,
      humanName,
      youtubeId,
      rawSubscriberCount,
      description,
    );
  }
}

export default ScrapedChannelData;

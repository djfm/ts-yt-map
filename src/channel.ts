import { Page } from 'puppeteer';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

import { log } from './lib';
import { convertNumber } from './util';

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
  User = '/user/',
  Raw = '/',
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

  return ChannelType.Raw;
};

@Entity()
export class ScrapedChannelData {
  @Column()
  @Length(1)
  public url: string = '';

  @Column()
  @Length(1)
  public htmlLang: string = 'en';

  @Column({ name: 'type' })
  public channelType: ChannelType = ChannelType.C;

  @Column()
  @Length(1)
  public shortName: string = '';

  @Column()
  @Length(1)
  public humanName: string = '';

  @Column()
  @Length(1)
  public youtubeId: string = '';

  @Column()
  @Length(1)
  public rawSubscriberCount: string = '';

  @Column()
  @Length(1)
  public description: string = '';

  public static async scrape(
    page: Page, url: string, acceptCookies = true,
    attemptNumber = 1, maxAttempts = 3,
  ): Promise<ScrapedChannelData> {
    log.info(`Scraping channel URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}...`);

    try {
      return await ScrapedChannelData.try_scrape(page, url, acceptCookies);
    } catch (e) {
      if (attemptNumber < maxAttempts) {
        log.info(`Failed to scrape channel URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}`);
        return ScrapedChannelData.scrape(page, url, acceptCookies, attemptNumber + 1, maxAttempts);
      }

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

    const res = new ScrapedChannelData();
    res.url = url;

    res.htmlLang = await getAttribute(page, 'html', 'lang');

    const urlSegments = url.split(/\/+/);
    if (urlSegments.length === 4) {
      res.shortName = decodeURIComponent(urlSegments[3]);
    } else if (urlSegments.length === 3) {
      res.shortName = decodeURIComponent(urlSegments[2]);
    } else {
      throw new Error(`Invalid channel URL: ${url}`);
    }

    res.humanName = await getInnerText(page, '#channel-name yt-formatted-string');
    res.rawSubscriberCount = await getInnerText(page, '#subscriber-count');

    const youtubeId = (await getAttribute(page, 'link[rel=canonical]', 'href')).split(/\/+/).at(-1);

    if (youtubeId === undefined) {
      throw new Error('Could not find channel youtubeId');
    }

    res.youtubeId = youtubeId;

    await navigateTo(page, `${url}/about`);
    res.description = await getInnerText(page, '#left-column #description');

    res.channelType = asChannelType(urlSegments[2]);

    return res;
  }
}

export default ScrapedChannelData;

@Entity()
export class Channel extends ScrapedChannelData {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public subscriberCount: number = -1;

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();

  constructor(channel?: ScrapedChannelData) {
    super();
    if (channel) {
      for (const [k, v] of Object.entries(channel)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[k] = v;
      }

      this.subscriberCount = convertNumber(this.rawSubscriberCount.split(' ')[0]);
    }
  }
}

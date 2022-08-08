import { Page } from 'puppeteer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

import { log } from './lib';
import ScrapedChannelData from './channel';

import {
  acceptCookiesIfAny,
  getElementsAttribute,
  getAttribute,
  getInnerText,
  navigateTo,
  takeScreenshot,
} from './page_util';

class ScrapedVideoData {
  @Column()
  @Length(1)
  public url: string = '';

  @Column()
  @Length(1)
  public rawLikeCount: string = '';

  @Column()
  @Length(1)
  public title: string = '';

  @Column()
  @Length(1)
  public description: string = '';

  @Column()
  @Length(1)
  public rawPublishedOn: string = '';

  public channelURL: string = '';

  public channel?: ScrapedChannelData;

  public recommendationURLs: string[] = [];

  public static async scrape(
    page: Page, url: string, acceptCookies = true,
  ): Promise<ScrapedVideoData> {
    log.info(`Scraping video URL: ${url}`);

    try {
      return await ScrapedVideoData.try_scrape(page, url, acceptCookies);
    } catch (e) {
      log.error(`Failed to scrape video URL: ${url}`, { error: e });
      await takeScreenshot(page, 'video_scrape_failure');
      throw e;
    }
  }

  static async try_scrape(
    page: Page, url: string, acceptCookies: boolean,
  ): Promise<ScrapedVideoData> {
    const res = new ScrapedVideoData();
    res.url = url;

    await navigateTo(page, url);

    if (acceptCookies) {
      await acceptCookiesIfAny(page);
    }

    const titleSelector = '#primary-inner h1.title yt-formatted-string';
    res.title = await getInnerText(page, titleSelector);

    const likeCountSelector = '#primary-inner #top-level-buttons-computed yt-formatted-string';
    res.rawLikeCount = await getInnerText(page, likeCountSelector);

    const descriptionMoreButtonSelector = 'ytd-video-secondary-info-renderer .more-button';
    try {
      const moreButton = await page.$(descriptionMoreButtonSelector);
      if (moreButton !== null) {
        await moreButton.click();
      }
    } catch (e) {
      // ignore, there was probably no more button
    }

    const descriptionSelector = 'ytd-video-secondary-info-renderer #description';
    res.description = (await getInnerText(page, descriptionSelector)).trimEnd();
    const publishedOnSelector = 'ytd-video-primary-info-renderer #info-text > div:last-child yt-formatted-string';
    res.rawPublishedOn = await getInnerText(page, publishedOnSelector);

    const channelPathSelector = 'ytd-video-owner-renderer yt-formatted-string.ytd-channel-name a';
    res.channelURL = await getAttribute(page, channelPathSelector, 'href');

    const recommendationURLsSelector = 'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer a#thumbnail';
    res.recommendationURLs = (await getElementsAttribute(page, recommendationURLsSelector, 'href')).map(
      (url) => url.replace(/^JSHandle:/, ''),
    );

    res.channel = await ScrapedChannelData.scrape(page, res.channelURL, false);

    log.info(`Successfully scraped video data from: ${url}`);

    return res;
  }
}

@Entity()
export class Video extends ScrapedVideoData {
  @PrimaryGeneratedColumn()
  public id: number = -1;

  @Column()
  public crawled: boolean = false;

  @Column()
  public latestCrawlAttemptedAt: Date = new Date(0);

  @Column()
  public crawlAttemptCount: number = 0;

  @Column()
  public likeCount: number = -1;

  @Column()
  public publishedOn: Date = new Date(0);

  @Column()
  public channelId: number = -1;

  constructor(video?: ScrapedVideoData) {
    super();
    if (video) {
      for (const [k, v] of Object.entries(video)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[k] = v;
      }
    }
  }
}

export default ScrapedVideoData;

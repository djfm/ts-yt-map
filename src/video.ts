import { Page } from 'puppeteer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Length } from 'class-validator';

import { log } from './lib';
import ScrapedChannelData from './channel';
import { convertNumber } from './util';

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

  @Column()
  @Length(1)
  public rawViewCount: string = '';

  public channelURL: string = '';

  public channel?: ScrapedChannelData;

  public recommendationURLs: string[] = [];

  public static async scrape(
    page: Page, url: string, acceptCookies = true,
    attemptNumber = 1, maxAttempts = 3,
    channelCache = new Map<string, ScrapedChannelData>(),
  ): Promise<ScrapedVideoData> {
    log.info(`Scraping video URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}...`);

    try {
      return await ScrapedVideoData.try_scrape(page, url, acceptCookies, channelCache);
    } catch (e) {
      if (attemptNumber < maxAttempts) {
        log.info(`Failed to scrape video URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}`);
        return ScrapedVideoData.scrape(
          page, url, acceptCookies, attemptNumber + 1, maxAttempts, channelCache,
        );
      }

      log.error(`Failed to scrape video URL: ${url}`, { error: e });
      await takeScreenshot(page, 'video_scrape_failure');
      throw e;
    }
  }

  static async try_scrape(
    page: Page, url: string, acceptCookies: boolean,
    channelCache: Map<string, ScrapedChannelData>,
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
    res.rawViewCount = await getInnerText(page, 'ytd-video-view-count-renderer span:first-child');

    const channelPathSelector = 'ytd-video-owner-renderer yt-formatted-string.ytd-channel-name a';
    res.channelURL = await getAttribute(page, channelPathSelector, 'href');

    const recommendationURLsSelector = 'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer a#thumbnail';
    res.recommendationURLs = (await getElementsAttribute(page, recommendationURLsSelector, 'href')).map(
      (url) => url.replace(/^JSHandle:/, ''),
    );

    // often a video recommends videos from the same channel,
    // no need to scrape them more than once
    if (channelCache.has(res.channelURL)) {
      log.info(`Found channel in cache: ${res.channelURL}`);
      res.channel = channelCache.get(res.channelURL);
    } else {
      log.info(`Scraping channel for video: ${res.channelURL}`);
      res.channel = await ScrapedChannelData.scrape(page, res.channelURL, false);
    }

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

  @Column()
  public viewCount: number = -1;

  @Column()
  public createdAt: Date = new Date();

  @Column()
  public updatedAt: Date = new Date();

  constructor(video?: ScrapedVideoData) {
    super();
    if (video) {
      for (const [k, v] of Object.entries(video)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[k] = v;
      }

      this.likeCount = convertNumber(this.rawLikeCount);
      this.viewCount = convertNumber(this.rawViewCount.split(' ')[0]);
      this.publishedOn = new Date(this.rawPublishedOn);
    }
  }
}

export default ScrapedVideoData;

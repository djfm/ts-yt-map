import { Page } from 'puppeteer';
import { Entity, Column, PrimaryColumn } from 'typeorm';

import { log } from './lib';

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
  public url: string = '';

  @Column()
  public rawLikeCount: number = 0;

  @Column()
  public title: string = '';


  @Column()
  public description: string = '';

  @Column()
  public rawPublishedOn: string = '';

  @Column()
  public channelURL: string = '';

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
    const title = await getInnerText(page, titleSelector);

    const likeCountSelector = '#primary-inner #top-level-buttons-computed yt-formatted-string';
    const rawLikeCount = await getInnerText(page, likeCountSelector);

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

    log.info(`Successfully scraped video data from: ${url}`);

    return res;
  }
}

@Entity()
export class Video extends ScrapedVideoData {
  @PrimaryColumn()
  public id: string = '';

  @Column()
  public crawled: boolean = false;

  @Column()
  public latestCrawlAttemtedAt: Date = new Date(0);

  @Column()
  public crawlAttemptCount: number = 0;
}

export default ScrapedVideoData;
import { Page } from 'puppeteer';
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
  constructor(
    public videoUrl: string,
    public rawLikeCount: string,
    public title: string,
    public description: string,
    public rawPublishedOn: string,
    public channelURL: string,
    public recommendationURLs: string[],
  ) {}

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
    const description = (await getInnerText(page, descriptionSelector)).trimEnd();
    const publishedOnSelector = 'ytd-video-primary-info-renderer #info-text > div:last-child yt-formatted-string';
    const rawPublishedOn = await getInnerText(page, publishedOnSelector);

    const channelPathSelector = 'ytd-video-owner-renderer yt-formatted-string.ytd-channel-name a';
    const channelURL = await getAttribute(page, channelPathSelector, 'href');

    const recommendationURLsSelector = 'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer a#thumbnail';
    const recommendationURLs = (await getElementsAttribute(page, recommendationURLsSelector, 'href')).map(
      (url) => url.replace(/^JSHandle:/, ''),
    );

    log.info(`Successfully scraped video data from: ${url}`);

    return new ScrapedVideoData(
      url,
      rawLikeCount,
      title,
      description,
      rawPublishedOn,
      channelURL,
      recommendationURLs,
    );
  }
}

export default ScrapedVideoData;

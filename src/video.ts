import { Page } from 'puppeteer';

import {
  acceptCookiesIfAny,
  getInnerText,
} from './page_util';

class ScrapedVideoData {
  constructor(
    public videoUrl: string,
    public rawLikeCount: string,
    public title: string,
    public description: string,
    public rawPublishedOn: string,
    public channelUrl: string,
    public recommendationURLs: string[],
  ) {}

  public static async scrape(page: Page, url: string): Promise<ScrapedVideoData> {
    await page.goto(url);
    await acceptCookiesIfAny(page);

    const titleSelector = '#primary-inner h1.title yt-formatted-string';
    const title = await getInnerText(page, titleSelector);

    const likeCountSelector = '#primary-inner #top-level-buttons-computed yt-formatted-string';
    const rawLikeCount = await getInnerText(page, likeCountSelector);

    const descriptionMoreButtonSelector = 'ytd-video-secondary-info-renderer .more-button';

    return new ScrapedVideoData(
      url,
      rawLikeCount,
      title,
      '',
      '',
      '',
      [],
    );
  }
}

export default ScrapedVideoData;

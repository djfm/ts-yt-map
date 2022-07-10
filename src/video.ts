import { Page } from 'puppeteer';

import {
  accept_cookies_if_any,
  get_inner_text,
} from './page_util';

class ScrapedVideoData {
  constructor(
    public video_url: string,
    public raw_like_count: string,
    public title: string,
    public description: string,
    public raw_published_on: string,
    public channel_url: string,
    public recommendation_urls: string[]
  ) {}

  public static async scrape(page: Page, url: string): Promise<ScrapedVideoData> {
    await page.goto(url);
    await accept_cookies_if_any(page);

    let title_selector = "#primary-inner h1.title yt-formatted-string";
    let title = await get_inner_text(page, title_selector);

    let like_count_selector = "#primary-inner #top-level-buttons-computed yt-formatted-string";
    let raw_like_count = await get_inner_text(page, like_count_selector);

    let description_more_button_selector = "ytd-video-secondary-info-renderer .more-button";

    return new ScrapedVideoData(
      url,
      "",
      title,
      "",
      "",
      "",
      []
    );
  }
}

export default ScrapedVideoData;

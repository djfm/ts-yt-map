import { loadChromeConfig, LoggerInterface, loadConfig } from './lib';
import Browser from './browser';
import { ScrapedVideoData, Video } from './video';
import { ScrapedChannelData, asChannelType } from './channel';
import PageUtil from './pageUtil';

export class ScrapedRecommendationData {
  constructor(
    // eslint-disable-next-line camelcase
    public client_name: string,
    public from: ScrapedVideoData,
    public to: ScrapedVideoData[],
  ) {}
}

/*
export class ScrapedRecommendation {
  constructor(
    public from: ScrapedVideoData,
    public to: ScrapedVideoData[],
  ) {
    this.from = new Video(from);
    this.to = to.map((v) => new Video(v));
  }
}
*/

export class Scraper {
  constructor(private readonly log: LoggerInterface) {}

  private channelCache: Map<string, ScrapedChannelData> = new Map();

  async scrapeRecommendations(videoURL: string): Promise<ScrapedRecommendationData> {
    try {
      return await this.try_scrapeRecommendations(videoURL);
    } catch (e) {
      this.log.error(`Failed to scrape recommendations for video URL: ${videoURL}`, { error: e });
      throw e;
    }
  }

  async try_scrapeRecommendations(videoURL: string): Promise<ScrapedRecommendationData> {
    // eslint-disable-next-line camelcase
    const { client_name } = await loadConfig();

    this.log.info(`Scraping recommendations from URL: ${videoURL}`);
    const cfg = await loadChromeConfig();
    this.log.info(cfg);
    const browser = await Browser.launch(cfg);

    if (this.channelCache.size > 100) {
      this.log.info('Clearing channel cache');
      this.channelCache.clear();
    }

    try {
      const page = await browser.newPage();
      const pageUtil = new PageUtil(this.log, page);

      const from = await this.scrapeVideo(pageUtil, videoURL, true);
      const to: ScrapedVideoData[] = [];

      for (let i = 0; i < from.recommendationURLs.length && i < 10; i += 1) {
        this.log.info(`Scraping recommendation ${i + 1} of ${Math.min(from.recommendationURLs.length, 10)}...`);
        const url = from.recommendationURLs[i];
        // eslint-disable-next-line no-await-in-loop
        const video = await this.scrapeVideo(pageUtil, url, false, 1, 3, this.channelCache);
        if (video.channel) {
          this.channelCache.set(video.channelURL, video.channel);
        }
        to.push(video);
      }
      return new ScrapedRecommendationData(client_name, from, to);
    } finally {
      await browser.close();
    }
  }

  public async scrapeVideo(
    page: PageUtil, url: string, acceptCookies = true,
    attemptNumber = 1, maxAttempts = 3,
    channelCache = new Map<string, ScrapedChannelData>(),
  ): Promise<ScrapedVideoData> {
    this.log.info(`Scraping video URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}...`);

    try {
      return await this.try_scrapeVideo(page, url, acceptCookies, channelCache);
    } catch (e) {
      if (attemptNumber < maxAttempts) {
        this.log.info(`Failed to scrape video URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}`);
        this.log.error(e);
        return this.scrapeVideo(
          page, url, acceptCookies,
          attemptNumber + 1, maxAttempts,
          channelCache,
        );
      }

      this.log.error(`Failed to scrape video URL: ${url}`, { error: e });
      await page.takeScreenshot('video_scrape_failure');
      throw e;
    }
  }

  async try_scrapeVideo(
    page: PageUtil, url: string, acceptCookies: boolean,
    channelCache: Map<string, ScrapedChannelData>,
  ): Promise<ScrapedVideoData> {
    const res = new ScrapedVideoData();
    res.url = url;

    await page.navigateTo(url);

    if (acceptCookies) {
      await page.acceptCookiesIfAny();
    }

    // const titleSelector = '#primary-inner h1.title yt-formatted-string';
    // changed 01/11/2022 to:
    const titleSelector = 'ytd-watch-metadata h1';
    res.title = await page.getInnerText(titleSelector);

    // const likeCountSelector = '#primary-inner #top-level-buttons-computed yt-formatted-string';
    // changed 01/11/2022 to:
    const likeCountSelector = 'ytd-toggle-button-renderer yt-button-shape:first-child';
    res.rawLikeCount = await page.getInnerText(likeCountSelector);

    const descriptionMoreButtonSelector = 'ytd-video-secondary-info-renderer .more-button';
    try {
      const moreButton = await page.findElementHandle(descriptionMoreButtonSelector);
      if (moreButton !== null) {
        await moreButton.click();
      }
    } catch (e) {
      // ignore, there was probably no more button
    }

    const descriptionSelector = 'ytd-video-secondary-info-renderer #description';
    res.description = (await page.getInnerText(descriptionSelector)).trimEnd();
    const publishedOnSelector = 'ytd-video-primary-info-renderer #info-text > div:last-child yt-formatted-string';
    res.rawPublishedOn = await page.getInnerText(publishedOnSelector);
    res.rawViewCount = await page.getInnerText('ytd-video-view-count-renderer span:first-child');

    const channelPathSelector = 'ytd-video-owner-renderer yt-formatted-string.ytd-channel-name a';
    res.channelURL = await page.getAttribute(channelPathSelector, 'href');

    const recommendationURLsSelector = 'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer a#thumbnail';
    res.recommendationURLs = (await page.getElementsAttribute(recommendationURLsSelector, 'href')).map(
      (url) => url.replace(/^JSHandle:/, ''),
    );

    // often a video recommends videos from the same channel,
    // no need to scrape them more than once
    if (channelCache.has(res.channelURL)) {
      this.log.info(`Found channel in cache: ${res.channelURL}`);
      res.channel = channelCache.get(res.channelURL);
    } else {
      this.log.info(`Scraping channel for video: ${res.channelURL}`);
      res.channel = await this.scrapeChannel(page, res.channelURL, false);
    }

    this.log.info(`Successfully scraped video: ${url}\n"${
      res.channel?.humanName
    } / ${res.title}"`);
    return res;
  }

  public async scrapeChannel(
    page: PageUtil, url: string, acceptCookies = true,
    attemptNumber = 1, maxAttempts = 3,
  ): Promise<ScrapedChannelData> {
    this.log.info(`Scraping channel URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}...`);

    try {
      return await this.try_scrapeChannel(page, url, acceptCookies);
    } catch (e) {
      if (attemptNumber < maxAttempts) {
        this.log.info(`Failed to scrape channel URL: ${url}, attempt ${attemptNumber} of ${maxAttempts}`);
        return this.scrapeChannel(page, url, acceptCookies, attemptNumber + 1, maxAttempts);
      }
      this.log.error(`Failed to scrape channel URL: ${url}`, { error: e });
      await page.takeScreenshot('channel_scrape_failure');
      throw e;
    }
  }

  async try_scrapeChannel(
    page: PageUtil, url: string, acceptCookies: boolean,
  ): Promise<ScrapedChannelData> {
    await page.navigateTo(url);

    if (acceptCookies) {
      await page.acceptCookiesIfAny();
    }

    const res = new ScrapedChannelData();
    res.url = url;
    res.htmlLang = await page.getAttribute('html', 'lang');

    const urlSegments = url.split(/\/+/);
    if (urlSegments.length === 4) {
      res.shortName = decodeURIComponent(urlSegments[3]);
    } else if (urlSegments.length === 3) {
      res.shortName = decodeURIComponent(urlSegments[2]);
    } else {
      throw new Error(`Invalid channel URL: ${url}`);
    }

    res.humanName = await page.getInnerText('#channel-name yt-formatted-string');
    res.rawSubscriberCount = await page.getInnerText('#subscriber-count');

    const youtubeId = (await page.getAttribute('link[rel=canonical]', 'href')).split(/\/+/).at(-1);

    if (youtubeId === undefined) {
      throw new Error('Could not find channel youtubeId');
    }

    res.youtubeId = youtubeId;

    await page.navigateTo(`${url}/about`);
    try {
      res.description = await page.getInnerText('#left-column #description');
    } catch (e) {
      res.description = '';
      this.log.error(`Failed to scrape channel description: ${url}`, { error: e });
    }

    res.channelType = asChannelType(urlSegments[2]);

    return res;
  }
}

export default Scraper;

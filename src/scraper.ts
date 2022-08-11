import { loadChromeConfig, log } from './lib';
import Browser from './browser';
import ScrapedVideoData from './video';
import ScrapedChannelData from './channel';

export class ScrapedRecommendationData {
  constructor(
    public from: ScrapedVideoData,
    public to: ScrapedVideoData[],
  ) {}

  static async scrapeRecommendations(videoURL: string): Promise<ScrapedRecommendationData> {
    try {
      return await this.try_scrapeRecommendations(videoURL);
    } catch (e) {
      log.error(`Failed to scrape recommendations for video URL: ${videoURL}`, { error: e });
      throw e;
    }
  }

  static async try_scrapeRecommendations(videoURL: string): Promise<ScrapedRecommendationData> {
    log.info(`Scraping recommendations from URL: ${videoURL}`);
    const cfg = await loadChromeConfig();
    const browser = await Browser.launch(cfg);

    try {
      const page = await browser.newPage();
      const from = await ScrapedVideoData.scrape(page, videoURL, true);
      const to: ScrapedVideoData[] = [];

      const channelCache = new Map<string, ScrapedChannelData>();

      for (let i = 0; i < from.recommendationURLs.length && i < 10; i += 1) {
        log.info(`Scraping recommendation ${i + 1} of ${Math.min(from.recommendationURLs.length, 10)}...`);
        const url = from.recommendationURLs[i];
        // eslint-disable-next-line no-await-in-loop
        const video = await ScrapedVideoData.scrape(page, url, false, 1, 3, channelCache);
        if (video.channel) {
          channelCache.set(video.channelURL, video.channel);
        }
        to.push(video);
      }
      return new ScrapedRecommendationData(from, to);
    } finally {
      await browser.close();
    }
  }
}

export default ScrapedRecommendationData;

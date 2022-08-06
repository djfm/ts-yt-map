import { loadConfig, log } from './lib';
import Browser from './browser';
import ScrapedChannelData from './channel';
import ScrapedVideoData from './video';

export class ScrapedRecommendationData {
  constructor(
    public fromChannel: ScrapedChannelData,
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
    const cfg = loadConfig('');
    const browser = await Browser.launch(cfg.chrome);
    const page = await browser.newPage();

    const from = await ScrapedVideoData.scrape(page, videoURL, true);
    const fromChannel = await ScrapedChannelData.scrape(page, from.channelURL, false);
    const to: ScrapedVideoData[] = [];

    for (let i = 0; i < from.recommendationURLs.length && i < 10; i += 1) {
      log.info(`Scraping recommendation ${i + 1} of ${Math.min(from.recommendationURLs.length, 10)}...`);
      const url = from.recommendationURLs[i];
      // eslint-disable-next-line no-await-in-loop
      const video = await ScrapedVideoData.scrape(page, url, false);
      to.push(video);
    }

    await browser.close();

    return new ScrapedRecommendationData(fromChannel, from, to);
  }
}

export default ScrapedRecommendationData;

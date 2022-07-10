import Browser from '../src/browser';
import ScrapedVideoData from '../src/video';

jest.setTimeout(60000);

describe('Basic browser tests', () => {
  it('should be able to launch a browser', async () => {
    const browser = await Browser.launch();
    browser.close();
  });

  it('should scrape a single video', async () => {
    const browser = await Browser.launch();
    const page = await browser.newPage();

    const video = await ScrapedVideoData.scrape(page, 'https://www.youtube.com/watch?v=a1zevmYu1v4');
    expect(video.title).toBe('Drone over Quiet Lake in the Morning');
    expect(+video.rawLikeCount).toBeGreaterThanOrEqual(1);

    browser.close();
  });
});

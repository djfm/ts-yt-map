import Browser from '../src/browser';
import ScrapedVideoData from '../src/video';

jest.setTimeout(60000);

describe("Basic browser tests", () => {
  it("should be able to launch a browser", async () => {
    let browser = await Browser.launch();
    browser.close();
  });

  it("should scrape a single video", async () => {
    let browser = await Browser.launch();
    let page = await browser.newPage();

    let video = await ScrapedVideoData.scrape(page, "https://www.youtube.com/watch?v=a1zevmYu1v4");
    expect(video.title).toBe("Drone over Quiet Lake in the Morning");

    browser.close();
  });
});

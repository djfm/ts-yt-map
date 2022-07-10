import Browser from '../src/browser';

describe("Basic browser tests", () => {
  it("should be able to launch a browser", async () => {
    let browser = await Browser.launch();
    browser.close();
  });
});

import ScrapedRecommendationData from '../../src/scraper';

jest.setTimeout(600000);

describe('Scraping a bunch of recommendations', () => {
  it('should scrape one video and its recommendations', async () => {
    const scraped = await ScrapedRecommendationData.scrapeRecommendations('https://www.youtube.com/watch?v=XzBPavzY3eE');
    expect(scraped.to.length).toBe(10);
  });
});

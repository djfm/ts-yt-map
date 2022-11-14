"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Scraper = exports.ScrapedRecommendationData = void 0;
var lib_1 = require("./lib");
var browser_1 = __importDefault(require("./browser"));
var video_1 = require("./models/video");
var channel_1 = require("./models/channel");
var pageUtil_1 = __importDefault(require("./pageUtil"));
var ScrapedRecommendationData = /** @class */ (function () {
    function ScrapedRecommendationData(
    // eslint-disable-next-line camelcase
    client_name, projectId, from, to) {
        this.client_name = client_name;
        this.projectId = projectId;
        this.from = from;
        this.to = to;
    }
    return ScrapedRecommendationData;
}());
exports.ScrapedRecommendationData = ScrapedRecommendationData;
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
var Scraper = /** @class */ (function () {
    function Scraper(log, clientSettings) {
        this.log = log;
        this.clientSettings = clientSettings;
        this.channelCache = new Map();
    }
    Scraper.prototype.scrapeRecommendations = function (videoURL) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.try_scrapeRecommendations(videoURL)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        this.log.error("Failed to scrape recommendations for video URL: ".concat(videoURL), { error: e_1 });
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Scraper.prototype.try_scrapeRecommendations = function (videoURL) {
        return __awaiter(this, void 0, void 0, function () {
            var client_name, cfg, browser, page, pageUtil, from, to, i, url, video;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, lib_1.loadConfig)()];
                    case 1:
                        client_name = (_a.sent()).client_name;
                        this.log.info("Scraping recommendations from URL: ".concat(videoURL));
                        return [4 /*yield*/, (0, lib_1.loadChromeConfig)()];
                    case 2:
                        cfg = _a.sent();
                        this.log.info(cfg);
                        return [4 /*yield*/, browser_1["default"].launch(cfg)];
                    case 3:
                        browser = _a.sent();
                        if (this.channelCache.size > 100) {
                            this.log.info('Clearing channel cache');
                            this.channelCache.clear();
                        }
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, , 11, 13]);
                        return [4 /*yield*/, browser.newPage()];
                    case 5:
                        page = _a.sent();
                        pageUtil = new pageUtil_1["default"](this.log, page);
                        return [4 /*yield*/, this.scrapeVideo(pageUtil, videoURL, true)];
                    case 6:
                        from = _a.sent();
                        to = [];
                        i = 0;
                        _a.label = 7;
                    case 7:
                        if (!(i < from.recommendationURLs.length && i < 10)) return [3 /*break*/, 10];
                        this.log.info("Scraping recommendation ".concat(i + 1, " of ").concat(Math.min(from.recommendationURLs.length, 10), "..."));
                        url = from.recommendationURLs[i];
                        return [4 /*yield*/, this.scrapeVideo(pageUtil, url, false, 1, 3, this.channelCache)];
                    case 8:
                        video = _a.sent();
                        if (video.channel) {
                            this.channelCache.set(video.channelURL, video.channel);
                        }
                        to.push(video);
                        _a.label = 9;
                    case 9:
                        i += 1;
                        return [3 /*break*/, 7];
                    case 10: return [2 /*return*/, new ScrapedRecommendationData(this.clientSettings.name, this.clientSettings.projectId, from, to)];
                    case 11: return [4 /*yield*/, browser.close()];
                    case 12:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Scraper.prototype.scrapeVideo = function (page, url, acceptCookies, attemptNumber, maxAttempts, channelCache) {
        if (acceptCookies === void 0) { acceptCookies = true; }
        if (attemptNumber === void 0) { attemptNumber = 1; }
        if (maxAttempts === void 0) { maxAttempts = 3; }
        if (channelCache === void 0) { channelCache = new Map(); }
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.info("Scraping video URL: ".concat(url, ", attempt ").concat(attemptNumber, " of ").concat(maxAttempts, "..."));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this.try_scrapeVideo(page, url, acceptCookies, channelCache)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_2 = _a.sent();
                        if (attemptNumber < maxAttempts) {
                            this.log.info("Failed to scrape video URL: ".concat(url, ", attempt ").concat(attemptNumber, " of ").concat(maxAttempts));
                            this.log.error(e_2);
                            return [2 /*return*/, this.scrapeVideo(page, url, acceptCookies, attemptNumber + 1, maxAttempts, channelCache)];
                        }
                        this.log.error("Failed to scrape video URL: ".concat(url), { error: e_2 });
                        return [4 /*yield*/, page.takeScreenshot('video_scrape_failure')];
                    case 4:
                        _a.sent();
                        throw e_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Scraper.prototype.try_scrapeVideo = function (page, url, acceptCookies, channelCache) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var res, titleSelector, _b, likeCountSelector, _c, descriptionMoreButtonSelector, moreButton, e_3, descriptionSelector, _d, publishedOnSelector, _e, _f, channelPathSelector, _g, recommendationURLsSelector, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        res = new video_1.ScrapedVideoData();
                        res.url = url;
                        return [4 /*yield*/, page.navigateTo(url)];
                    case 1:
                        _k.sent();
                        if (!acceptCookies) return [3 /*break*/, 3];
                        return [4 /*yield*/, page.acceptCookiesIfAny()];
                    case 2:
                        _k.sent();
                        _k.label = 3;
                    case 3:
                        titleSelector = 'ytd-watch-metadata h1';
                        _b = res;
                        return [4 /*yield*/, page.getInnerText(titleSelector)];
                    case 4:
                        _b.title = _k.sent();
                        likeCountSelector = 'ytd-toggle-button-renderer yt-button-shape:first-child';
                        _c = res;
                        return [4 /*yield*/, page.getInnerText(likeCountSelector)];
                    case 5:
                        _c.rawLikeCount = _k.sent();
                        descriptionMoreButtonSelector = 'ytd-video-secondary-info-renderer .more-button';
                        _k.label = 6;
                    case 6:
                        _k.trys.push([6, 10, , 11]);
                        return [4 /*yield*/, page.findElementHandle(descriptionMoreButtonSelector)];
                    case 7:
                        moreButton = _k.sent();
                        if (!(moreButton !== null)) return [3 /*break*/, 9];
                        return [4 /*yield*/, moreButton.click()];
                    case 8:
                        _k.sent();
                        _k.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        e_3 = _k.sent();
                        return [3 /*break*/, 11];
                    case 11:
                        descriptionSelector = 'ytd-video-secondary-info-renderer #description';
                        _d = res;
                        return [4 /*yield*/, page.getInnerText(descriptionSelector)];
                    case 12:
                        _d.description = (_k.sent()).trimEnd();
                        publishedOnSelector = 'ytd-video-primary-info-renderer #info-text > div:last-child yt-formatted-string';
                        _e = res;
                        return [4 /*yield*/, page.getInnerText(publishedOnSelector)];
                    case 13:
                        _e.rawPublishedOn = _k.sent();
                        _f = res;
                        return [4 /*yield*/, page.getInnerText('ytd-video-view-count-renderer span:first-child')];
                    case 14:
                        _f.rawViewCount = _k.sent();
                        channelPathSelector = 'ytd-video-owner-renderer yt-formatted-string.ytd-channel-name a';
                        _g = res;
                        return [4 /*yield*/, page.getAttribute(channelPathSelector, 'href')];
                    case 15:
                        _g.channelURL = _k.sent();
                        recommendationURLsSelector = 'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer a#thumbnail';
                        _h = res;
                        return [4 /*yield*/, page.getElementsAttribute(recommendationURLsSelector, 'href')];
                    case 16:
                        _h.recommendationURLs = (_k.sent()).map(function (url) { return url.replace(/^JSHandle:/, ''); });
                        if (!channelCache.has(res.channelURL)) return [3 /*break*/, 17];
                        this.log.info("Found channel in cache: ".concat(res.channelURL));
                        res.channel = channelCache.get(res.channelURL);
                        return [3 /*break*/, 19];
                    case 17:
                        this.log.info("Scraping channel for video: ".concat(res.channelURL));
                        _j = res;
                        return [4 /*yield*/, this.scrapeChannel(page, res.channelURL, false)];
                    case 18:
                        _j.channel = _k.sent();
                        _k.label = 19;
                    case 19:
                        this.log.info("Successfully scraped video: ".concat(url, "\n\"").concat((_a = res.channel) === null || _a === void 0 ? void 0 : _a.humanName, " / ").concat(res.title, "\""));
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Scraper.prototype.scrapeChannel = function (page, url, acceptCookies, attemptNumber, maxAttempts) {
        if (acceptCookies === void 0) { acceptCookies = true; }
        if (attemptNumber === void 0) { attemptNumber = 1; }
        if (maxAttempts === void 0) { maxAttempts = 3; }
        return __awaiter(this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.info("Scraping channel URL: ".concat(url, ", attempt ").concat(attemptNumber, " of ").concat(maxAttempts, "..."));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, this.try_scrapeChannel(page, url, acceptCookies)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_4 = _a.sent();
                        if (attemptNumber < maxAttempts) {
                            this.log.info("Failed to scrape channel URL: ".concat(url, ", attempt ").concat(attemptNumber, " of ").concat(maxAttempts));
                            return [2 /*return*/, this.scrapeChannel(page, url, acceptCookies, attemptNumber + 1, maxAttempts)];
                        }
                        this.log.error("Failed to scrape channel URL: ".concat(url), { error: e_4 });
                        return [4 /*yield*/, page.takeScreenshot('channel_scrape_failure')];
                    case 4:
                        _a.sent();
                        throw e_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Scraper.prototype.try_scrapeChannel = function (page, url, acceptCookies) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, urlSegments, _b, _c, youtubeId, _d, e_5;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, page.navigateTo(url)];
                    case 1:
                        _e.sent();
                        if (!acceptCookies) return [3 /*break*/, 3];
                        return [4 /*yield*/, page.acceptCookiesIfAny()];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        res = new channel_1.ScrapedChannelData();
                        res.url = url;
                        _a = res;
                        return [4 /*yield*/, page.getAttribute('html', 'lang')];
                    case 4:
                        _a.htmlLang = _e.sent();
                        urlSegments = url.split(/\/+/);
                        if (urlSegments.length === 4) {
                            res.shortName = decodeURIComponent(urlSegments[3]);
                        }
                        else if (urlSegments.length === 3) {
                            res.shortName = decodeURIComponent(urlSegments[2]);
                        }
                        else {
                            throw new Error("Invalid channel URL: ".concat(url));
                        }
                        _b = res;
                        return [4 /*yield*/, page.getInnerText('#channel-name yt-formatted-string')];
                    case 5:
                        _b.humanName = _e.sent();
                        _c = res;
                        return [4 /*yield*/, page.getInnerText('#subscriber-count')];
                    case 6:
                        _c.rawSubscriberCount = _e.sent();
                        return [4 /*yield*/, page.getAttribute('link[rel=canonical]', 'href')];
                    case 7:
                        youtubeId = (_e.sent()).split(/\/+/).at(-1);
                        if (youtubeId === undefined) {
                            throw new Error('Could not find channel youtubeId');
                        }
                        res.youtubeId = youtubeId;
                        return [4 /*yield*/, page.navigateTo("".concat(url, "/about"))];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9:
                        _e.trys.push([9, 11, , 12]);
                        _d = res;
                        return [4 /*yield*/, page.getInnerText('#left-column #description')];
                    case 10:
                        _d.description = _e.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        e_5 = _e.sent();
                        res.description = '';
                        this.log.error("Failed to scrape channel description: ".concat(url), { error: e_5 });
                        return [3 /*break*/, 12];
                    case 12:
                        res.channelType = (0, channel_1.asChannelType)(urlSegments[2]);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    return Scraper;
}());
exports.Scraper = Scraper;
exports["default"] = Scraper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JhcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUFzRTtBQUN0RSxzREFBZ0M7QUFDaEMsd0NBQXlEO0FBQ3pELDRDQUFxRTtBQUNyRSx3REFBa0M7QUFHbEM7SUFDRTtJQUNFLHFDQUFxQztJQUM5QixXQUFtQixFQUNuQixTQUFpQixFQUNqQixJQUFzQixFQUN0QixFQUFzQjtRQUh0QixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2pCLFNBQUksR0FBSixJQUFJLENBQWtCO1FBQ3RCLE9BQUUsR0FBRixFQUFFLENBQW9CO0lBQzVCLENBQUM7SUFDTixnQ0FBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksOERBQXlCO0FBVXRDOzs7Ozs7Ozs7O0VBVUU7QUFFRjtJQUNFLGlCQUNtQixHQUFvQixFQUNwQixjQUE4QjtRQUQ5QixRQUFHLEdBQUgsR0FBRyxDQUFpQjtRQUNwQixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFHekMsaUJBQVksR0FBb0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUYvRCxDQUFDO0lBSUUsdUNBQXFCLEdBQTNCLFVBQTRCLFFBQWdCOzs7Ozs7O3dCQUVqQyxxQkFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLEVBQUE7NEJBQXJELHNCQUFPLFNBQThDLEVBQUM7Ozt3QkFFdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsMERBQW1ELFFBQVEsQ0FBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzVGLE1BQU0sR0FBQyxDQUFDOzs7OztLQUVYO0lBRUssMkNBQXlCLEdBQS9CLFVBQWdDLFFBQWdCOzs7Ozs0QkFFdEIscUJBQU0sSUFBQSxnQkFBVSxHQUFF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
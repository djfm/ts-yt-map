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
var video_1 = require("./video");
var channel_1 = require("./channel");
var pageUtil_1 = __importDefault(require("./pageUtil"));
var ScrapedRecommendationData = /** @class */ (function () {
    function ScrapedRecommendationData(
    // eslint-disable-next-line camelcase
    client_name, from, to) {
        this.client_name = client_name;
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
    function Scraper(log) {
        this.log = log;
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
                    case 10: return [2 /*return*/, new ScrapedRecommendationData(client_name, from, to)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyYXBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zY3JhcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUFzRTtBQUN0RSxzREFBZ0M7QUFDaEMsaUNBQWtEO0FBQ2xELHFDQUE4RDtBQUM5RCx3REFBa0M7QUFFbEM7SUFDRTtJQUNFLHFDQUFxQztJQUM5QixXQUFtQixFQUNuQixJQUFzQixFQUN0QixFQUFzQjtRQUZ0QixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNuQixTQUFJLEdBQUosSUFBSSxDQUFrQjtRQUN0QixPQUFFLEdBQUYsRUFBRSxDQUFvQjtJQUM1QixDQUFDO0lBQ04sZ0NBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQVBZLDhEQUF5QjtBQVN0Qzs7Ozs7Ozs7OztFQVVFO0FBRUY7SUFDRSxpQkFBNkIsR0FBb0I7UUFBcEIsUUFBRyxHQUFILEdBQUcsQ0FBaUI7UUFFekMsaUJBQVksR0FBb0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUZkLENBQUM7SUFJL0MsdUNBQXFCLEdBQTNCLFVBQTRCLFFBQWdCOzs7Ozs7O3dCQUVqQyxxQkFBTSxJQUFJLENBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLEVBQUE7NEJBQXJELHNCQUFPLFNBQThDLEVBQUM7Ozt3QkFFdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsMERBQW1ELFFBQVEsQ0FBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7d0JBQzVGLE1BQU0sR0FBQyxDQUFDOzs7OztLQUVYO0lBRUssMkNBQXlCLEdBQS9CLFVBQWdDLFFBQWdCOzs7Ozs0QkFFdEIscUJBQU0sSUFBQSxnQkFBVSxHQUFFLEVBQUE7O3dCQUFsQyxXQUFXLEdBQUssQ0FBQSxTQUFrQixDQUFBLFlBQXZCO3dCQUVuQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUks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
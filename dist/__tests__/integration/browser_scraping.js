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
exports.__esModule = true;
var browser_1 = require("../../browser");
var lib_1 = require("../../lib");
var channel_1 = require("../../channel");
var scraper_1 = require("../../scraper");
var pageUtil_1 = require("../../pageUtil");
jest.setTimeout(600000);
var browser;
var scraper;
var page;
var log;
beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    var cfg, browserPage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, lib_1.loadChromeConfig)()];
            case 1:
                cfg = _a.sent();
                return [4 /*yield*/, browser_1.Browser.launch(cfg)];
            case 2:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 3:
                browserPage = _a.sent();
                return [4 /*yield*/, (0, lib_1.createLogger)()];
            case 4:
                log = _a.sent();
                scraper = new scraper_1.Scraper(log);
                page = new pageUtil_1.PageUtil(log, browserPage);
                return [2 /*return*/];
        }
    });
}); });
afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, browser.close()];
            case 1:
                _a.sent();
                log.close();
                return [2 /*return*/];
        }
    });
}); });
describe('Basic browser scraping tests', function () {
    it('should scrape a single video', function () { return __awaiter(void 0, void 0, void 0, function () {
        var video;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, scraper.scrapeVideo(page, 'https://www.youtube.com/watch?v=a1zevmYu1v4')];
                case 1:
                    video = _a.sent();
                    expect(video.url).toBe('https://www.youtube.com/watch?v=a1zevmYu1v4');
                    expect(video.channelURL).toBe('https://www.youtube.com/c/FrançoisMariedeJouvencel');
                    expect(video.title).toBe('Drone over Quiet Lake in the Morning');
                    expect(+video.rawLikeCount).toBeGreaterThanOrEqual(1);
                    expect(+video.rawViewCount.split(' ')[0]).toBeGreaterThanOrEqual(1);
                    expect(video.description).toBe('Another Bebop2 footage from a while ago.');
                    expect(video.recommendationURLs.length).toBeGreaterThanOrEqual(10);
                    video.recommendationURLs.forEach(function (url) {
                        expect(url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should scrape a single channel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var channel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, scraper.scrapeChannel(page, 'https://www.youtube.com/c/FrançoisMariedeJouvencel')];
                case 1:
                    channel = _a.sent();
                    expect(channel.htmlLang).toBe('en');
                    expect(channel.humanName).toBe('François-Marie de Jouvencel');
                    expect(channel.shortName).toBe('FrançoisMariedeJouvencel');
                    expect(channel.rawSubscriberCount).toMatch(/^\d\s+subscribers?$/);
                    expect(channel.description).toBe('[youchoose:15068d5ba5e3b86d1182fbef8d0ae938cb091c63]');
                    expect(channel.channelType).toBe(channel_1.ChannelType.C);
                    expect(channel.youtubeId).toBe('UCmHeND0P_fw8BLk8ITNzvHQ');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9zY3JhcGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9fX3Rlc3RzX18vaW50ZWdyYXRpb24vYnJvd3Nlcl9zY3JhcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUF3QztBQUN4QyxpQ0FBNEU7QUFDNUUseUNBQTRDO0FBQzVDLHlDQUF3QztBQUN4QywyQ0FBMEM7QUFFMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUV4QixJQUFJLE9BQWdCLENBQUM7QUFDckIsSUFBSSxPQUFnQixDQUFDO0FBQ3JCLElBQUksSUFBYyxDQUFDO0FBQ25CLElBQUksR0FBb0IsQ0FBQztBQUV6QixVQUFVLENBQUM7Ozs7b0JBQ0cscUJBQU0sSUFBQSxzQkFBZ0IsR0FBRSxFQUFBOztnQkFBOUIsR0FBRyxHQUFHLFNBQXdCO2dCQUMxQixxQkFBTSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBQTs7Z0JBQW5DLE9BQU8sR0FBRyxTQUF5QixDQUFDO2dCQUNoQixxQkFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUE7O2dCQUFyQyxXQUFXLEdBQUcsU0FBdUI7Z0JBQ3JDLHFCQUFNLElBQUEsa0JBQVksR0FBRSxFQUFBOztnQkFBMUIsR0FBRyxHQUFHLFNBQW9CLENBQUM7Z0JBQzNCLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLElBQUksR0FBRyxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDOzs7O0tBQ3ZDLENBQUMsQ0FBQztBQUVILFNBQVMsQ0FBQzs7O29CQUNSLHFCQUFNLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBQTs7Z0JBQXJCLFNBQXFCLENBQUM7Z0JBQ3RCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7OztLQUNiLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyw4QkFBOEIsRUFBRTtJQUN2QyxFQUFFLENBQUMsOEJBQThCLEVBQUU7Ozs7d0JBQ25CLHFCQUFNLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLDZDQUE2QyxDQUFDLEVBQUE7O29CQUF0RixLQUFLLEdBQUcsU0FBOEU7b0JBQzVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7b0JBQ3RFLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLG9EQUFvRCxDQUFDLENBQUM7b0JBQ3BGLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7b0JBQ2pFLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztvQkFDM0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFbkUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7d0JBQ25DLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMseUNBQXlDLENBQUMsQ0FBQztvQkFDakUsQ0FBQyxDQUFDLENBQUM7Ozs7U0FDSixDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7Ozs7d0JBQ25CLHFCQUFNLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLG9EQUFvRCxDQUFDLEVBQUE7O29CQUFqRyxPQUFPLEdBQUcsU0FBdUY7b0JBRXZHLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO29CQUM5RCxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO29CQUMzRCxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7b0JBQ2xFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7b0JBQ3pGLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hELE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7Ozs7U0FDNUQsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==
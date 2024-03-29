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
exports.Client = exports.ClientSettings = void 0;
var scraper_1 = require("../scraper");
var ClientSettings = /** @class */ (function () {
    function ClientSettings(name, seedVideo, projectId) {
        this.name = name;
        this.seedVideo = seedVideo;
        this.projectId = projectId;
    }
    return ClientSettings;
}());
exports.ClientSettings = ClientSettings;
var Client = /** @class */ (function () {
    function Client(log, api, clientSettings) {
        this.log = log;
        this.api = api;
        this.clientSettings = clientSettings;
    }
    Client.prototype.scrapeOneVideoAndItsRecommendations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, scraper, scraped, tries, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.getUrlToCrawl()];
                    case 1:
                        url = _a.sent();
                        if (!url) {
                            this.log.info('No more URLs to crawl, done!');
                            return [2 /*return*/, { ok: true, count: 0 }];
                        }
                        scraper = new scraper_1.Scraper(this.log, this.clientSettings);
                        return [4 /*yield*/, scraper.scrapeRecommendations(url)];
                    case 2:
                        scraped = _a.sent();
                        tries = 3;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.api.saveRecommendations(scraped)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5:
                        e_1 = _a.sent();
                        this.log.error("Failed to save recommendations for URL: ".concat(url, ", retrying"), { error: e_1 });
                        if (tries > 0) {
                            tries -= 1;
                            return [2 /*return*/, this.api.saveRecommendations(scraped)];
                        }
                        this.log.error("Failed to save recommendations for URL: ".concat(url), { error: e_1 });
                        throw e_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Client;
}());
exports.Client = Client;
exports["default"] = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esc0NBQXFDO0FBR3JDO0lBQ0Usd0JBQ2tCLElBQVksRUFDWixTQUFpQixFQUNqQixTQUFpQjtRQUZqQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFRO0lBQ2hDLENBQUM7SUFDTixxQkFBQztBQUFELENBQUMsQUFORCxJQU1DO0FBTlksd0NBQWM7QUFRM0I7SUFDRSxnQkFDbUIsR0FBb0IsRUFDcEIsR0FBUSxFQUNSLGNBQThCO1FBRjlCLFFBQUcsR0FBSCxHQUFHLENBQWlCO1FBQ3BCLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFDUixtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7SUFDOUMsQ0FBQztJQUVFLG9EQUFtQyxHQUF6Qzs7Ozs7NEJBQ2MscUJBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsRUFBQTs7d0JBQXBDLEdBQUcsR0FBRyxTQUE4Qjt3QkFFMUMsSUFBSSxDQUFDLEdBQUcsRUFBRTs0QkFDUixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOzRCQUM5QyxzQkFBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDO3lCQUMvQjt3QkFFSyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUMzQyxxQkFBTSxPQUFPLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLEVBQUE7O3dCQUFsRCxPQUFPLEdBQUcsU0FBd0M7d0JBQ3BELEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7d0JBRUwscUJBQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBQTs0QkFBbEQsc0JBQU8sU0FBMkMsRUFBQzs7O3dCQUVuRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxrREFBMkMsR0FBRyxlQUFZLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBQyxFQUFFLENBQUMsQ0FBQzt3QkFDekYsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFOzRCQUNiLEtBQUssSUFBSSxDQUFDLENBQUM7NEJBQ1gsc0JBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBQzt5QkFDOUM7d0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0RBQTJDLEdBQUcsQ0FBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7d0JBQy9FLE1BQU0sR0FBQyxDQUFDOzs7OztLQUVYO0lBQ0gsYUFBQztBQUFELENBQUMsQUE5QkQsSUE4QkM7QUE5Qlksd0JBQU07QUFnQ25CLHFCQUFlLE1BQU0sQ0FBQyJ9
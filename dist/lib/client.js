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
exports.Client = void 0;
var scraper_1 = require("../scraper");
var Client = /** @class */ (function () {
    function Client(log, api) {
        this.log = log;
        this.api = api;
    }
    Client.prototype.scrapeOneVideoAndItsRecommendations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, scraper, scraped, tries;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.getUrlToCrawl()];
                    case 1:
                        url = _a.sent();
                        scraper = new scraper_1.Scraper(this.log);
                        return [4 /*yield*/, scraper.scrapeRecommendations(url)];
                    case 2:
                        scraped = _a.sent();
                        tries = 3;
                        try {
                            return [2 /*return*/, this.api.saveRecommendations(scraped)];
                        }
                        catch (e) {
                            this.log.error("Failed to save recommendations for URL: ".concat(url, ", retrying"), { error: e });
                            if (tries > 0) {
                                tries -= 1;
                                return [2 /*return*/, this.api.saveRecommendations(scraped)];
                            }
                            this.log.error("Failed to save recommendations for URL: ".concat(url), { error: e });
                            throw e;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Client;
}());
exports.Client = Client;
exports["default"] = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esc0NBQXFDO0FBR3JDO0lBQ0UsZ0JBQTZCLEdBQW9CLEVBQW1CLEdBQVE7UUFBL0MsUUFBRyxHQUFILEdBQUcsQ0FBaUI7UUFBbUIsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUFHLENBQUM7SUFFMUUsb0RBQW1DLEdBQXpDOzs7Ozs0QkFDYyxxQkFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxFQUFBOzt3QkFBcEMsR0FBRyxHQUFHLFNBQThCO3dCQUNwQyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDdEIscUJBQU0sT0FBTyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxFQUFBOzt3QkFBbEQsT0FBTyxHQUFHLFNBQXdDO3dCQUNwRCxLQUFLLEdBQUcsQ0FBQyxDQUFDO3dCQUNkLElBQUk7NEJBQ0Ysc0JBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsRUFBQzt5QkFDOUM7d0JBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQ1YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0RBQTJDLEdBQUcsZUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ3pGLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtnQ0FDYixLQUFLLElBQUksQ0FBQyxDQUFDO2dDQUNYLHNCQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUM7NkJBQzlDOzRCQUNELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGtEQUEyQyxHQUFHLENBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUMvRSxNQUFNLENBQUMsQ0FBQzt5QkFDVDs7Ozs7S0FDRjtJQUNILGFBQUM7QUFBRCxDQUFDLEFBcEJELElBb0JDO0FBcEJZLHdCQUFNO0FBc0JuQixxQkFBZSxNQUFNLENBQUMifQ==
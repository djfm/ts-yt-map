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
exports.Browser = exports.ChromeConfig = void 0;
var puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
var puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1["default"].use((0, puppeteer_extra_plugin_stealth_1["default"])());
var ChromeConfig = /** @class */ (function () {
    function ChromeConfig(data) {
        this.headless = true;
        this.proxy_uri = false;
        Object.assign(this, data);
    }
    return ChromeConfig;
}());
exports.ChromeConfig = ChromeConfig;
var Browser = /** @class */ (function () {
    function Browser(browser) {
        this.browser = browser;
    }
    Browser.launch = function (cfg) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var args, defaultViewport, puppeteerBrowser, browser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        args = [];
                        if (cfg.proxy_uri) {
                            args.push("--proxy-server=".concat(cfg.proxy_uri));
                        }
                        // for docker, running as root requires this
                        if (process.env.UID === undefined) {
                            args.push('--no-sandbox', '--disable-setuid-sandbox');
                        }
                        defaultViewport = {
                            width: 1980 + Math.round(Math.random() * 100),
                            height: 1980 + Math.round(Math.random() * 100)
                        };
                        return [4 /*yield*/, puppeteer_extra_1["default"].launch({
                                headless: (_a = cfg.headless) !== null && _a !== void 0 ? _a : false,
                                defaultViewport: defaultViewport,
                                args: args
                            })];
                    case 1:
                        puppeteerBrowser = _b.sent();
                        browser = new Browser(puppeteerBrowser);
                        return [2 /*return*/, browser];
                }
            });
        });
    };
    Browser.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Browser.prototype.newPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        page = _a.sent();
                        page.setDefaultNavigationTimeout(60000);
                        page.setDefaultTimeout(30000);
                        return [2 /*return*/, page];
                }
            });
        });
    };
    return Browser;
}());
exports.Browser = Browser;
exports["default"] = Browser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9icm93c2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLG9FQUF3QztBQUN4QyxrR0FBMkQ7QUFFM0QsNEJBQVMsQ0FBQyxHQUFHLENBQUMsSUFBQSwyQ0FBYSxHQUFFLENBQUMsQ0FBQztBQUUvQjtJQUtFLHNCQUFZLElBQTZCO1FBSnpDLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFFekIsY0FBUyxHQUFtQixLQUFLLENBQUM7UUFHaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFSWSxvQ0FBWTtBQVV6QjtJQUNFLGlCQUFvQixPQUF5QjtRQUF6QixZQUFPLEdBQVAsT0FBTyxDQUFrQjtJQUU3QyxDQUFDO0lBRVksY0FBTSxHQUFuQixVQUFvQixHQUFpQjs7Ozs7Ozt3QkFDN0IsSUFBSSxHQUFHLEVBQUUsQ0FBQzt3QkFFaEIsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFOzRCQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLHlCQUFrQixHQUFHLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBQzt5QkFDOUM7d0JBRUQsNENBQTRDO3dCQUM1QyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRTs0QkFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsMEJBQTBCLENBQUMsQ0FBQzt5QkFDdkQ7d0JBRUssZUFBZSxHQUFHOzRCQUN0QixLQUFLLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQzs0QkFDN0MsTUFBTSxFQUFFLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUM7eUJBQy9DLENBQUM7d0JBRXVCLHFCQUFNLDRCQUFTLENBQUMsTUFBTSxDQUFDO2dDQUM5QyxRQUFRLEVBQUUsTUFBQSxHQUFHLENBQUMsUUFBUSxtQ0FBSSxLQUFLO2dDQUMvQixlQUFlLGlCQUFBO2dDQUNmLElBQUksTUFBQTs2QkFDTCxDQUFDLEVBQUE7O3dCQUpJLGdCQUFnQixHQUFHLFNBSXZCO3dCQUVJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO3dCQUU5QyxzQkFBTyxPQUFPLEVBQUM7Ozs7S0FDaEI7SUFFWSx1QkFBSyxHQUFsQjs7Ozs0QkFDRSxxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFBOzt3QkFBMUIsU0FBMEIsQ0FBQzs7Ozs7S0FDNUI7SUFFWSx5QkFBTyxHQUFwQjs7Ozs7NEJBQ2UscUJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQTs7d0JBQW5DLElBQUksR0FBRyxTQUE0Qjt3QkFDekMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN4QyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7d0JBQzlCLHNCQUFPLElBQUksRUFBQzs7OztLQUNiO0lBQ0gsY0FBQztBQUFELENBQUMsQUEzQ0QsSUEyQ0M7QUEzQ1ksMEJBQU87QUE2Q3BCLHFCQUFlLE9BQU8sQ0FBQyJ9
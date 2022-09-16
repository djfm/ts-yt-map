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
exports.PageUtil = void 0;
var util_1 = require("./util");
var PageUtil = /** @class */ (function () {
    function PageUtil(log, page) {
        var _this = this;
        this.log = log;
        this.page = page;
        this.waitDelay = 5000;
        this.setWaitDelay = function (ms) {
            _this.waitDelay = ms;
            return _this;
        };
        this.getWaitDelay = function () { return _this.waitDelay; };
        this.navigateTo = function (url) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.debug("Navigating to URL: ".concat(url));
                        return [4 /*yield*/, this.page.goto(url)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, util_1.sleep)(this.waitDelay)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.acceptCookiesIfAny = function () { return __awaiter(_this, void 0, void 0, function () {
            var elt, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.debug('Trying to accept cookies if any...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.page.waitForSelector('.eom-button-row ytd-button-renderer.style-primary:last-of-type, [aria-label*="Accept"]')];
                    case 2:
                        elt = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.log.debug('No cookies to accept');
                        return [2 /*return*/, true];
                    case 4:
                        if (!elt) {
                            this.log.debug('No cookies were found');
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, elt.click()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, (0, util_1.sleep)(this.waitDelay)];
                    case 6:
                        _a.sent();
                        this.log.debug('Cookies were clicked');
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.takeScreenshot = function (prefix) { return __awaiter(_this, void 0, void 0, function () {
            var url, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.page.url().split('?')[0].split('/').slice(1).join('_');
                        path = "".concat(this.log.getRootDirectory(), "/screenshot_").concat(prefix, "_").concat(url, "_").concat(new Date().toISOString(), ".png");
                        return [4 /*yield*/, this.page.screenshot({ path: path })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.tryToGetInnerText = function (selector, remainingAttempts) { return __awaiter(_this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.evaluate(function (s) {
                            var _a;
                            var elt = document.querySelector(s);
                            if (!elt) {
                                return null;
                            }
                            return (_a = elt.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                        }, selector)];
                    case 1:
                        res = _a.sent();
                        if (!!res) return [3 /*break*/, 4];
                        if (!(remainingAttempts > 0)) return [3 /*break*/, 3];
                        // eslint-disable-next-line no-promise-executor-return
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.waitDelay); })];
                    case 2:
                        // eslint-disable-next-line no-promise-executor-return
                        _a.sent();
                        return [2 /*return*/, this.tryToGetInnerText(selector, remainingAttempts - 1)];
                    case 3: throw new Error("Could not get inner text for selector: '".concat(selector, "'"));
                    case 4: return [2 /*return*/, res];
                }
            });
        }); };
        this.getInnerText = function (selector) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.log.debug("Getting inner text for selector: '".concat(selector, "'"));
                return [2 /*return*/, this.tryToGetInnerText(selector, 2)];
            });
        }); };
        this.findAllElementHandles = function (selector) { return __awaiter(_this, void 0, void 0, function () {
            var eltHandles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.$$(selector)];
                    case 1:
                        eltHandles = _a.sent();
                        return [2 /*return*/, eltHandles];
                }
            });
        }); };
        this.getAttribute = function (selector, attribute) { return __awaiter(_this, void 0, void 0, function () {
            var eltHandle, elt, rawAttr, attr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.debug("Getting attribute '".concat(attribute, "' for selector: '").concat(selector, "'"));
                        return [4 /*yield*/, this.page.waitForSelector(selector)];
                    case 1:
                        eltHandle = _a.sent();
                        if (!eltHandle) {
                            throw new Error("Could not get attribute '".concat(attribute, "' for selector: '").concat(selector, "' - element handle not found"));
                        }
                        elt = eltHandle.asElement();
                        if (!elt) {
                            throw new Error("Could not get attribute ".concat(attribute, " for selector ").concat(selector, ": could not get element from handle.'").concat(selector));
                        }
                        return [4 /*yield*/, elt.getProperty(attribute)];
                    case 2:
                        rawAttr = (_a.sent()).toString();
                        attr = decodeURI(rawAttr.split('JSHandle:')[1]);
                        return [2 /*return*/, attr];
                }
            });
        }); };
        this.getElementAttribute = function (elt, attribute) { return __awaiter(_this, void 0, void 0, function () {
            var handle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handle = elt.asElement();
                        if (handle === null) {
                            throw new Error("Could not get attribute '".concat(attribute, "' for element: '").concat(elt, "'"));
                        }
                        return [4 /*yield*/, handle.getProperty(attribute)];
                    case 1: return [2 /*return*/, (_a.sent()).toString()];
                }
            });
        }); };
        this.getElementsAttribute = function (selector, attribute) { return __awaiter(_this, void 0, void 0, function () {
            var handles, values;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log.debug("Getting attribute '".concat(attribute, "' for all elements matching selector: '").concat(selector, "'"));
                        return [4 /*yield*/, this.findAllElementHandles(selector)];
                    case 1:
                        handles = _a.sent();
                        return [4 /*yield*/, Promise.all(handles.map(function (h) { return _this.getElementAttribute(h, attribute); }))];
                    case 2:
                        values = _a.sent();
                        return [2 /*return*/, values];
                }
            });
        }); };
        this.findElementHandle = function (selector) {
            _this.log.debug("Finding all elements matching selector: '".concat(selector, "'"));
            return _this.page.$(selector);
        };
    }
    return PageUtil;
}());
exports.PageUtil = PageUtil;
exports["default"] = PageUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGFnZVV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsK0JBQStCO0FBRS9CO0lBR0Usa0JBQ21CLEdBQW9CLEVBQ3BCLElBQVU7UUFGN0IsaUJBR0k7UUFGZSxRQUFHLEdBQUgsR0FBRyxDQUFpQjtRQUNwQixTQUFJLEdBQUosSUFBSSxDQUFNO1FBSnJCLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFPakMsaUJBQVksR0FBRyxVQUFDLEVBQVU7WUFDeEIsS0FBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDcEIsT0FBTyxLQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7UUFFRixpQkFBWSxHQUFHLGNBQWMsT0FBQSxLQUFJLENBQUMsU0FBUyxFQUFkLENBQWMsQ0FBQztRQUU1QyxlQUFVLEdBQUcsVUFBTyxHQUFXOzs7O3dCQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyw2QkFBc0IsR0FBRyxDQUFFLENBQUMsQ0FBQzt3QkFDNUMscUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUE7O3dCQUF6QixTQUF5QixDQUFDO3dCQUMxQixxQkFBTSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUE7O3dCQUEzQixTQUEyQixDQUFDOzs7O2FBQzdCLENBQUM7UUFFRix1QkFBa0IsR0FBRzs7Ozs7d0JBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7Ozs7d0JBRzdDLHFCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUNuQyx3RkFBd0YsQ0FDekYsRUFBQTs7d0JBRkQsR0FBRyxHQUFHLFNBRUwsQ0FBQzs7Ozt3QkFFRixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxz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
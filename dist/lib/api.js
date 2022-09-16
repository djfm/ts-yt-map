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
exports.API = void 0;
var v1_1 = require("../endpoints/v1");
var hasURL = function (o) {
    return typeof o === 'object' && o !== null && 'url' in o
        && typeof o.url === 'string';
};
var hasCount = function (o) {
    return typeof o === 'object' && o !== null && 'ok' in o && 'count' in o
        && typeof o.ok === 'boolean';
};
var hasQueries = function (o) {
    return typeof o === 'object' && o !== null && 'queries' in o
        && Array.isArray(o.queries);
};
var API = /** @class */ (function () {
    function API(log, url, password) {
        this.log = log;
        this.url = url;
        this.password = password;
    }
    API.prototype.getUrlToCrawl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var urlResp, e_1, u;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch("".concat(this.url).concat(v1_1.POSTGetUrlToCrawl), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-password': this.password
                                }
                            })];
                    case 1:
                        urlResp = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.log.error('Failed to get URL to crawl', { error: e_1 });
                        this.log.error("Server URL was: ".concat(this.url));
                        throw e_1;
                    case 3:
                        if (!urlResp.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, urlResp.json()];
                    case 4:
                        u = _a.sent();
                        if (hasURL(u)) {
                            return [2 /*return*/, u.url];
                        }
                        _a.label = 5;
                    case 5:
                        this.log.error(urlResp);
                        throw new Error('Failed to get URL to crawl');
                }
            });
        });
    };
    API.prototype.saveRecommendations = function (recoData) {
        return __awaiter(this, void 0, void 0, function () {
            var res, got;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.url).concat(v1_1.POSTRecommendation), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-password': this.password
                            },
                            body: JSON.stringify(recoData)
                        })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        got = _a.sent();
                        if (hasCount(got)) {
                            return [2 /*return*/, got];
                        }
                        _a.label = 3;
                    case 3:
                        this.log.error(res.statusText, { res: res });
                        throw new Error('Failed to save recommendations');
                }
            });
        });
    };
    API.prototype.forTestingClearDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, got;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.url).concat(v1_1.POSTClearDbForTesting), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-password': this.password
                            }
                        })];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json()];
                    case 2:
                        got = _a.sent();
                        if (hasQueries(got)) {
                            return [2 /*return*/, got];
                        }
                        _a.label = 3;
                    case 3:
                        this.log.error(res.statusText, { res: res });
                        throw new Error('Failed to clear db');
                }
            });
        });
    };
    return API;
}());
exports.API = API;
exports["default"] = API;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsc0NBQStGO0FBRS9GLElBQU0sTUFBTSxHQUFHLFVBQUMsQ0FBVTtJQUN4QixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDO1dBQzlDLE9BQVEsQ0FBcUIsQ0FBQyxHQUFHLEtBQUssUUFBUTtBQURqRCxDQUNpRCxDQUFDO0FBRXBELElBQU0sUUFBUSxHQUFHLFVBQUMsQ0FBVTtJQUMxQixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLENBQUM7V0FDN0QsT0FBUSxDQUFpQyxDQUFDLEVBQUUsS0FBSyxTQUFTO0FBRDdELENBQzZELENBQUM7QUFFaEUsSUFBTSxVQUFVLEdBQUcsVUFBQyxDQUFVO0lBQzVCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksU0FBUyxJQUFJLENBQUM7V0FDbEQsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUEwQixDQUFDLE9BQU8sQ0FBQztBQURyRCxDQUNxRCxDQUFDO0FBQ3hEO0lBQ0UsYUFDbUIsR0FBb0IsRUFDcEIsR0FBVyxFQUNYLFFBQWdCO1FBRmhCLFFBQUcsR0FBSCxHQUFHLENBQWlCO1FBQ3BCLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFDWCxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQ2hDLENBQUM7SUFFUywyQkFBYSxHQUExQjs7Ozs7Ozt3QkFJYyxxQkFBTSxLQUFLLENBQUMsVUFBRyxJQUFJLENBQUMsR0FBRyxTQUFHLHNCQUFpQixDQUFFLEVBQUU7Z0NBQ3ZELE1BQU0sRUFBRSxNQUFNO2dDQUNk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
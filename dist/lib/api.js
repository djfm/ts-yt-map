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
exports.API = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var v1_1 = require("../endpoints/v1");
var client_1 = __importDefault(require("../client"));
var fetch_1 = __importDefault(require("../fetch"));
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
        var _this = this;
        this.log = log;
        this.url = url;
        this.password = password;
        this.fetch = function (method, url) { return __awaiter(_this, void 0, void 0, function () {
            var f, ok;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        f = new fetch_1["default"](url)
                            .setFamily(6)
                            .setHeader('Content-Type', 'application/json')
                            .setHeader('x-password', this.password)
                            .setMethod(method);
                        return [4 /*yield*/, f.ok()];
                    case 1:
                        ok = _a.sent();
                        this.log.error(f.text());
                        if (ok) {
                            return [2 /*return*/, f.json()];
                        }
                        throw new Error("Call to \"".concat(url, "\" failed."));
                }
            });
        }); };
    }
    API.prototype.getUrlToCrawl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch('POST', "".concat(this.url).concat(v1_1.POSTGetUrlToCrawl))];
                    case 1:
                        res = _a.sent();
                        if (hasURL(res)) {
                            return [2 /*return*/, res.url];
                        }
                        throw new Error('Could not get URL to crawl');
                }
            });
        });
    };
    API.prototype.saveRecommendations = function (recoData) {
        return __awaiter(this, void 0, void 0, function () {
            var res, got;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.url).concat(v1_1.POSTRecommendation), {
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
                    case 0: return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.url).concat(v1_1.POSTClearDbForTesting), {
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
    API.prototype.getIP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, got;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.url).concat(v1_1.GETIP), {
                            method: 'GET',
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
                        return [2 /*return*/, got.ip];
                    case 3: return [2 /*return*/, Promise.reject(new Error('Failed to get IP'))];
                }
            });
        });
    };
    API.prototype.createClient = function (data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var client, _a, resp, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        client = new client_1["default"](data);
                        _a = client;
                        return [4 /*yield*/, this.getIP()];
                    case 1:
                        _a.ip = _c.sent();
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.url).concat(v1_1.POSTClientCreate), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-password': this.password
                                },
                                body: JSON.stringify(client)
                            })];
                    case 2:
                        resp = _c.sent();
                        if (!resp.ok) return [3 /*break*/, 4];
                        _b = client_1["default"].bind;
                        return [4 /*yield*/, resp.json()];
                    case 3: return [2 /*return*/, new (_b.apply(client_1["default"], [void 0, _c.sent()]))()];
                    case 4:
                        this.log.error(resp.statusText, { resp: resp });
                        throw new Error('Failed to create client');
                }
            });
        });
    };
    return API;
}());
exports.API = API;
exports["default"] = API;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQTZDO0FBSTdDLHNDQUF3SDtBQUN4SCxxREFBK0I7QUFDL0IsbURBQXlDO0FBRXpDLElBQU0sTUFBTSxHQUFHLFVBQUMsQ0FBVTtJQUN4QixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDO1dBQzlDLE9BQVEsQ0FBcUIsQ0FBQyxHQUFHLEtBQUssUUFBUTtBQURqRCxDQUNpRCxDQUFDO0FBRXBELElBQU0sUUFBUSxHQUFHLFVBQUMsQ0FBVTtJQUMxQixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLENBQUM7V0FDN0QsT0FBUSxDQUFpQyxDQUFDLEVBQUUsS0FBSyxTQUFTO0FBRDdELENBQzZELENBQUM7QUFFaEUsSUFBTSxVQUFVLEdBQUcsVUFBQyxDQUFVO0lBQzVCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksU0FBUyxJQUFJLENBQUM7V0FDbEQsS0FBSyxDQUFDLE9BQU8sQ0FBRSxDQUEwQixDQUFDLE9BQU8sQ0FBQztBQURyRCxDQUNxRCxDQUFDO0FBQ3hEO0lBQ0UsYUFDbUIsR0FBb0IsRUFDcEIsR0FBVyxFQUNYLFFBQWdCO1FBSG5DLGlCQUlJO1FBSGUsUUFBRyxHQUFILEdBQUcsQ0FBaUI7UUFDcEIsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUNYLGFBQVEsR0FBUixRQUFRLENBQVE7UUFHM0IsVUFBSyxHQUFHLFVBQU8sTUFBYyxFQUFFLEdBQVc7Ozs7O3dCQUMxQyxDQUFDLEdBQUcsSUFBSSxrQkFBSyxDQUFD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
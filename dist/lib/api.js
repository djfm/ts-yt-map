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
var v1_1 = require("../endpoints/v1");
var client_1 = __importDefault(require("../client"));
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
    API.prototype.getIP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, got;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.url).concat(v1_1.GETIP), {
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
                        return [4 /*yield*/, fetch("".concat(this.url).concat(v1_1.POSTClientCreate), {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsc0NBQXdIO0FBQ3hILHFEQUErQjtBQUUvQixJQUFNLE1BQU0sR0FBRyxVQUFDLENBQVU7SUFDeEIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQztXQUM5QyxPQUFRLENBQXFCLENBQUMsR0FBRyxLQUFLLFFBQVE7QUFEakQsQ0FDaUQsQ0FBQztBQUVwRCxJQUFNLFFBQVEsR0FBRyxVQUFDLENBQVU7SUFDMUIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDO1dBQzdELE9BQVEsQ0FBaUMsQ0FBQyxFQUFFLEtBQUssU0FBUztBQUQ3RCxDQUM2RCxDQUFDO0FBRWhFLElBQU0sVUFBVSxHQUFHLFVBQUMsQ0FBVTtJQUM1QixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLFNBQVMsSUFBSSxDQUFDO1dBQ2xELEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBMEIsQ0FBQyxPQUFPLENBQUM7QUFEckQsQ0FDcUQsQ0FBQztBQUN4RDtJQUNFLGFBQ21CLEdBQW9CLEVBQ3BCLEdBQVcsRUFDWCxRQUFnQjtRQUZoQixRQUFHLEdBQUgsR0FBRyxDQUFpQjtRQUNwQixRQUFHLEdBQUgsR0FBRyxDQUFRO1FBQ1gsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUNoQyxDQUFDO0lBRVMsMkJBQWEsR0FBMUI7Ozs7Ozs7d0JBSWMscUJBQU0sS0FBSyxDQUFDLFVBQUcsSUFBSSxDQUFDLEdBQUcsU0FBRyxzQkFBaUIsQ0FBRSxFQUFFO2dDQUN2RCxNQUFN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
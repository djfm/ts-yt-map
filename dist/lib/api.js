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
                        return [4 /*yield*/, (0, node_fetch_1["default"])("".concat(this.url).concat(v1_1.POSTGetUrlToCrawl), {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMERBQTZDO0FBSTdDLHNDQUF3SDtBQUN4SCxxREFBK0I7QUFFL0IsSUFBTSxNQUFNLEdBQUcsVUFBQyxDQUFVO0lBQ3hCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7V0FDOUMsT0FBUSxDQUFxQixDQUFDLEdBQUcsS0FBSyxRQUFRO0FBRGpELENBQ2lELENBQUM7QUFFcEQsSUFBTSxRQUFRLEdBQUcsVUFBQyxDQUFVO0lBQzFCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQztXQUM3RCxPQUFRLENBQWlDLENBQUMsRUFBRSxLQUFLLFNBQVM7QUFEN0QsQ0FDNkQsQ0FBQztBQUVoRSxJQUFNLFVBQVUsR0FBRyxVQUFDLENBQVU7SUFDNUIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxTQUFTLElBQUksQ0FBQztXQUNsRCxLQUFLLENBQUMsT0FBTyxDQUFFLENBQTBCLENBQUMsT0FBTyxDQUFDO0FBRHJELENBQ3FELENBQUM7QUFDeEQ7SUFDRSxhQUNtQixHQUFvQixFQUNwQixHQUFXLEVBQ1gsUUFBZ0I7UUFGaEIsUUFBRyxHQUFILEdBQUcsQ0FBaUI7UUFDcEIsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUNYLGFBQVEsR0FBUixRQUFRLENBQVE7SUFDaEMsQ0FBQztJQUVTLDJCQUFhLEdBQTFCOzs7Ozs7O3dCQUljLHFCQUFNLElBQUEsdUJBQUssRUFBQyxVQUFHLElBQUksQ0FBQyxHQUFHLFNBQUcsc0JBQWlCLENB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
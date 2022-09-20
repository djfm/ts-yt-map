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
var axios_1 = __importDefault(require("axios"));
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
var hasIP = function (o) {
    return typeof o === 'object' && o !== null && 'ip' in o;
};
var isClientPartial = function (o) {
    return typeof o === 'object' && o !== null && 'id' in o && 'ip' in o;
};
var API = /** @class */ (function () {
    function API(log, url, password) {
        this.log = log;
        this.url = url;
        this.password = password;
    }
    API.prototype.fetch = function (method, url, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, axios_1["default"])({
                        method: method,
                        url: url,
                        data: data,
                        headers: {
                            'X-Password': this.password
                        }
                    })
                        .then(function (res) { return res.data; })["catch"](function (err) {
                        _this.log.error(err);
                        throw err;
                    })];
            });
        });
    };
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
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch('POST', "".concat(this.url).concat(v1_1.POSTRecommendation), recoData)];
                    case 1:
                        res = _a.sent();
                        if (hasCount(res)) {
                            return [2 /*return*/, res];
                        }
                        throw new Error('Failed to save recommendations');
                }
            });
        });
    };
    API.prototype.forTestingClearDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch('POST', "".concat(this.url).concat(v1_1.POSTClearDbForTesting))];
                    case 1:
                        res = _a.sent();
                        if (hasQueries(res)) {
                            return [2 /*return*/, res];
                        }
                        throw new Error('Failed to clear db');
                }
            });
        });
    };
    API.prototype.getIP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch('GET', "".concat(this.url).concat(v1_1.GETIP))];
                    case 1:
                        res = _a.sent();
                        if (hasIP(res)) {
                            return [2 /*return*/, res.ip];
                        }
                        throw new Error('Failed to get IP');
                }
            });
        });
    };
    API.prototype.createClient = function (data) {
        if (data === void 0) { data = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var client, _a, resp;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        client = new client_1["default"](data);
                        _a = client;
                        return [4 /*yield*/, this.getIP()];
                    case 1:
                        _a.ip = _b.sent();
                        return [4 /*yield*/, this.fetch('POST', "".concat(this.url).concat(v1_1.POSTClientCreate), client)];
                    case 2:
                        resp = _b.sent();
                        if (isClientPartial(resp)) {
                            return [2 /*return*/, new client_1["default"](resp)];
                        }
                        throw new Error('Failed to create client');
                }
            });
        });
    };
    return API;
}());
exports.API = API;
exports["default"] = API;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBSTFCLHNDQUF3SDtBQUN4SCxxREFBK0I7QUFFL0IsSUFBTSxNQUFNLEdBQUcsVUFBQyxDQUFVO0lBQ3hCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7V0FDOUMsT0FBUSxDQUFxQixDQUFDLEdBQUcsS0FBSyxRQUFRO0FBRGpELENBQ2lELENBQUM7QUFFcEQsSUFBTSxRQUFRLEdBQUcsVUFBQyxDQUFVO0lBQzFCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQztXQUM3RCxPQUFRLENBQWlDLENBQUMsRUFBRSxLQUFLLFNBQVM7QUFEN0QsQ0FDNkQsQ0FBQztBQUVoRSxJQUFNLFVBQVUsR0FBRyxVQUFDLENBQVU7SUFDNUIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxTQUFTLElBQUksQ0FBQztXQUNsRCxLQUFLLENBQUMsT0FBTyxDQUFFLENBQTBCLENBQUMsT0FBTyxDQUFDO0FBRHJELENBQ3FELENBQUM7QUFFeEQsSUFBTSxLQUFLLEdBQUcsVUFBQyxDQUFVO0lBQ3ZCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUM7QUFBaEQsQ0FBZ0QsQ0FBQztBQUVuRCxJQUFNLGVBQWUsR0FBRyxVQUFDLENBQVU7SUFDakMsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FB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
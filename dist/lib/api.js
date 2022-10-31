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
    return API;
}());
exports.API = API;
exports["default"] = API;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBSTFCLHNDQUFzRztBQUd0RyxJQUFNLE1BQU0sR0FBRyxVQUFDLENBQVU7SUFDeEIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQztXQUM5QyxPQUFRLENBQXFCLENBQUMsR0FBRyxLQUFLLFFBQVE7QUFEakQsQ0FDaUQsQ0FBQztBQUVwRCxJQUFNLFFBQVEsR0FBRyxVQUFDLENBQVU7SUFDMUIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDO1dBQzdELE9BQVEsQ0FBaUMsQ0FBQyxFQUFFLEtBQUssU0FBUztBQUQ3RCxDQUM2RCxDQUFDO0FBRWhFLElBQU0sVUFBVSxHQUFHLFVBQUMsQ0FBVTtJQUM1QixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLFNBQVMsSUFBSSxDQUFDO1dBQ2xELEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBMEIsQ0FBQyxPQUFPLENBQUM7QUFEckQsQ0FDcUQsQ0FBQztBQUV4RCxJQUFNLEtBQUssR0FBRyxVQUFDLENBQVU7SUFDdkIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztBQUFoRCxDQUFnRCxDQUFDO0FBRW5ELElBQU0sZUFBZSxHQUFHLFVBQUMsQ0FBVTtJQUNqQyxPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJ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
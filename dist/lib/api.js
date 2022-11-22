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
var class_validator_1 = require("class-validator");
var v1_1 = require("../endpoints/v1");
var project_1 = require("../models/project");
var hasURL = function (o) {
    return typeof o === 'object' && o !== null && 'url' in o
        && typeof o.url === 'string';
};
var hasMessage = function (o) {
    return typeof o === 'object' && o !== null && 'message' in o;
};
var hasResponse = function (o) {
    return typeof o === 'object' && o !== null && 'response' in o;
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
var API = /** @class */ (function () {
    function API(log, url, password, clientSettings) {
        this.log = log;
        this.url = url;
        this.password = password;
        this.clientSettings = clientSettings;
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
                        if (err.response && err.response.data) {
                            _this.log.error(err.response.data);
                            if (err.response.data.message) {
                                throw new Error(err.response.data.message);
                            }
                        }
                        else {
                            _this.log.error(err);
                        }
                        throw err;
                    })];
            });
        });
    };
    API.prototype.getUrlToCrawl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.fetch('POST', "".concat(this.url).concat(v1_1.POSTGetUrlToCrawl), {
                                seed_video: this.clientSettings.seedVideo,
                                client_name: this.clientSettings.name,
                                project_id: this.clientSettings.projectId
                            })];
                    case 1:
                        res = _a.sent();
                        if (hasURL(res)) {
                            return [2 /*return*/, res.url];
                        }
                        throw new Error('Could not get URL to crawl');
                    case 2:
                        e_1 = _a.sent();
                        if (hasResponse(e_1) && hasMessage(e_1.response)) {
                            throw new Error(e_1.response.message);
                        }
                        throw e_1;
                    case 3: return [2 /*return*/];
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
    API.prototype.createProject = function (project) {
        return __awaiter(this, void 0, void 0, function () {
            var res, newProject, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetch('POST', "".concat(this.url).concat(v1_1.POSTCreateProject), project)];
                    case 1:
                        res = _a.sent();
                        newProject = new project_1.Project();
                        Object.assign(newProject, res);
                        return [4 /*yield*/, (0, class_validator_1.validate)(newProject)];
                    case 2:
                        errors = _a.sent();
                        if (errors.length > 0) {
                            throw new Error("Failed to create project: ".concat(errors.join(', ')));
                        }
                        return [2 /*return*/, newProject];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQTBCO0FBQzFCLG1EQUEyQztBQUkzQyxzQ0FNeUI7QUFHekIsNkNBQWtFO0FBRWxFLElBQU0sTUFBTSxHQUFHLFVBQUMsQ0FBVTtJQUN4QixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDO1dBQzlDLE9BQVEsQ0FBcUIsQ0FBQyxHQUFHLEtBQUssUUFBUTtBQURqRCxDQUNpRCxDQUFDO0FBRXBELElBQU0sVUFBVSxHQUFHLFVBQUMsQ0FBVTtJQUM1QixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLFNBQVMsSUFBSSxDQUFDO0FBQXJELENBQXFELENBQUM7QUFFeEQsSUFBTSxXQUFXLEdBQUcsVUFBQyxDQUFVO0lBQzdCLE9BQUEsT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksVUFBVSxJQUFJLENBQUM7QUFBdEQsQ0FBc0QsQ0FBQztBQUV6RCxJQUFNLFFBQVEsR0FBRyxVQUFDLENBQVU7SUFDMUIsT0FBQSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLE9BQU8sSUFBSSxDQUFDO1dBQzdELE9BQVEsQ0FBaUMsQ0FBQyxFQUFFLEtBQUssU0FBUztBQUQ3RCxDQUM2RCxDQUFDO0FBRWhFLElBQU0sVUFBVSxHQUFHLFVBQUMsQ0FBVTtJQUM1QixPQUFBLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLFNBQVMsSUFBSSxDQUFDO1dBQ2xELEtBQUssQ0FBQyxPQUFPLENBQUUsQ0FBMEIs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
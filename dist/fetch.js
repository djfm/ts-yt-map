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
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
var Fetch = /** @class */ (function () {
    function Fetch(url) {
        this.url = url;
        this.family = 6;
        this.headers = {};
        this.data = '';
        this.method = 'GET';
        this.parsedURL = new URL(url);
    }
    Fetch.prototype.setHeader = function (name, value) {
        this.headers[name.toLowerCase()] = value;
        return this;
    };
    Fetch.prototype.setMethod = function (method) {
        this.method = method;
        return this;
    };
    Fetch.prototype.setFamily = function (family) {
        this.family = family;
        return this;
    };
    Fetch.prototype.ok = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tryFetch;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tryFetch = function () { return __awaiter(_this, void 0, void 0, function () {
                            var proto, options, redirect;
                            var _this = this;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        this.data = '';
                                        if (!this.parsedURL) {
                                            throw new Error('URL was not parsed. This is a bug.');
                                        }
                                        proto = this.parsedURL.protocol === 'https:' ? https_1["default"] : http_1["default"];
                                        options = {
                                            agent: false,
                                            defaultPort: proto === https_1["default"] ? 443 : 80,
                                            headers: this.headers,
                                            host: this.parsedURL.host,
                                            hostname: this.parsedURL.hostname,
                                            insecureHTTPParser: false,
                                            method: this.method,
                                            path: this.parsedURL.pathname,
                                            protocol: this.parsedURL.protocol,
                                            timeout: 30000
                                        };
                                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                if (!_this.parsedURL) {
                                                    throw new Error('Missing URL for API call');
                                                }
                                                proto.request(_this.url, function (res) {
                                                    _this.statusCodeReceived = res.statusCode;
                                                    _this.responseHeaders = res.headers;
                                                    res.on('data', function (chunk) { return "".concat(_this.data).concat(chunk); });
                                                    res.on('end', resolve);
                                                    res.on('error', reject);
                                                }).end();
                                            })];
                                    case 1:
                                        _b.sent();
                                        if (!((_a = this.responseHeaders) === null || _a === void 0 ? void 0 : _a.redirect)) return [3 /*break*/, 3];
                                        redirect = this.responseHeaders.redirect;
                                        if (Array.isArray(redirect)) {
                                            this.url = redirect[0];
                                        }
                                        else {
                                            this.url = redirect;
                                        }
                                        this.parsedURL = new URL(this.url);
                                        return [4 /*yield*/, tryFetch()];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, tryFetch()];
                    case 1:
                        _a.sent();
                        if (!this.statusCodeReceived) {
                            return [2 /*return*/, false];
                        }
                        if (this.statusCodeReceived >= 200 && this.statusCodeReceived < 400) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    Fetch.prototype.statusCode = function () {
        if (!this.statusCodeReceived) {
            throw new Error('No Status Code received: was the query run?');
        }
        return this.statusCodeReceived;
    };
    Fetch.prototype.text = function () {
        if (!this.statusCodeReceived) {
            throw new Error('No Status Code received: was the query run?');
        }
        return this.data;
    };
    Fetch.prototype.json = function () {
        if (!this.statusCodeReceived) {
            throw new Error('No Status Code received: was the query run?');
        }
        if (!this.headers) {
            throw new Error('No Response headers.');
        }
        if (this.headers['Content-Type'] === 'application/json') {
            return JSON.parse(this.data);
        }
        throw new Error('"Content-Type: application/json" header not found.');
    };
    return Fetch;
}());
exports["default"] = Fetch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmV0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBaUQ7QUFDakQsZ0RBQTBCO0FBSTFCO0lBZUUsZUFBb0IsR0FBVztRQUFYLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFkdkIsV0FBTSxHQUFVLENBQUMsQ0FBQztRQUVsQixZQUFPLEdBQTJCLEVBQUUsQ0FBQztRQUlyQyxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBSWxCLFdBQU0sR0FBVyxLQUFLLENBQUM7UUFLN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQseUJBQVMsR0FBVCxVQUFVLElBQVksRUFBRSxLQUFhO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHlCQUFTLEdBQVQsVUFBVSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHlCQUFTLEdBQVQsVUFBVSxNQUFhO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVLLGtCQUFFLEdBQVI7Ozs7Ozs7d0JBQ1EsUUFBUSxHQUFHOzs7Ozs7O3dDQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO3dDQUVmLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFOzRDQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7eUNBQ3ZEO3dDQUVLLEtBQUssR0FBRyxJQUFJLENBQUMsU0FB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
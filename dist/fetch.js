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
                                            timeout: 30000,
                                            family: this.family
                                        };
                                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                if (!_this.parsedURL) {
                                                    throw new Error('Missing URL for API call');
                                                }
                                                proto.request(options, function (res) {
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
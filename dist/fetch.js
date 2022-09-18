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
                                            port: proto === https_1["default"] ? 443 : 80,
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
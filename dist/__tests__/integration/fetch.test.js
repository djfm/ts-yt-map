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
var portfinder_1 = __importDefault(require("portfinder"));
var fetch_1 = __importDefault(require("../../fetch"));
var server_1 = require("../../lib/server");
var lib_1 = require("../../lib");
var server;
var cfg;
var log;
var password = 'secret';
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, lib_1.loadServerConfig)(password)];
            case 1:
                cfg = _b.sent();
                _a = cfg;
                return [4 /*yield*/, portfinder_1["default"].getPortPromise()];
            case 2:
                _a.port = _b.sent();
                return [4 /*yield*/, (0, lib_1.createLogger)()];
            case 3:
                log = _b.sent();
                return [4 /*yield*/, (0, server_1.startServer)(cfg, log)];
            case 4:
                server = _b.sent();
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                log.close();
                return [2 /*return*/];
        }
    });
}); });
describe('The Fetch class', function () {
    it('determines the correct protocol', function () {
        var a = new URL('https://www.google.com');
        expect(a.protocol).toBe('https:');
        var b = new URL('http://example.com');
        expect(b.protocol).toBe('http:');
    });
    it('Should fetch the https google home-page', function () { return __awaiter(void 0, void 0, void 0, function () {
        var f, ok;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = new fetch_1["default"]('https://google.fr');
                    return [4 /*yield*/, f.ok()];
                case 1:
                    ok = _a.sent();
                    expect(ok).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Should fetch an https ipv4 site', function () { return __awaiter(void 0, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = new fetch_1["default"]('https://ipv4.fmdj.fr');
                    return [4 /*yield*/, f.ok()];
                case 1:
                    _a.sent();
                    expect(f.statusCode()).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get the text from an http ipv6 site', function () { return __awaiter(void 0, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = new fetch_1["default"]('http://ipv6.fmdj.fr');
                    return [4 /*yield*/, f.ok()];
                case 1:
                    _a.sent();
                    expect(f.text().trim()).toBe('lappy 1');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get the text from an ssl ipv6 website', function () { return __awaiter(void 0, void 0, void 0, function () {
        var f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    f = new fetch_1["default"]('https://ssl.ipv6.fmdj.fr');
                    return [4 /*yield*/, f.ok()];
                case 1:
                    _a.sent();
                    expect(f.text().trim()).toBe('lappy 2');
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9fX3Rlc3RzX18vaW50ZWdyYXRpb24vZmV0Y2gudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBEQUFvQztBQUVwQyxzREFBZ0M7QUFDaEMsMkNBQTZEO0FBQzdELGlDQUEwRjtBQUcxRixJQUFJLE1BQW9CLENBQUM7QUFDekIsSUFBSSxHQUFpQixDQUFDO0FBQ3RCLElBQUksR0FBb0IsQ0FBQztBQUN6QixJQUFNLFFBQVEsR0FBRyxRQUFRLENBQUM7QUFFMUIsU0FBUyxDQUFDOzs7O29CQUNGLHFCQUFNLElBQUEsc0JBQWdCLEVBQUMsUUFBUSxDQUFDLEVBQUE7O2dCQUF0QyxHQUFHLEdBQUcsU0FBZ0MsQ0FBQztnQkFDdkMsS0FBQSxHQUFHLENBQUE7Z0JBQVEscUJBQU0sdUJBQVUsQ0FBQyxjQUFjLEVBQUUsRUFBQTs7Z0JBQTVDLEdBQUksSUFBSSxHQUFHLFNBQWlDLENBQUM7Z0JBQ3ZDLHFCQUFNLElBQUEsa0JBQVksR0FBRSxFQUFBOztnQkFBMUIsR0FBRyxHQUFHLFNBQW9CLENBQUM7Z0JBQ2xCLHFCQUFNLElBQUEsb0JBQVcsRUFBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUE7O2dCQUFwQyxNQUFNLEdBQUcsU0FBMkIsQ0FBQzs7OztLQUN0QyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUM7OztvQkFDUCxxQkFBTSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUE7O2dCQUFwQixTQUFvQixDQUFDO2dCQUNyQixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7Ozs7S0FDYixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLElBQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDNUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFbEMsSUFBTSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN4QyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTs7Ozs7b0JBQ3RDLENBQUMsR0FBRyxJQUFJLGtCQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztvQkFDOUIscUJBQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFBOztvQkFBakIsRUFBRSxHQUFHLFNBQVk7b0JBQ3ZCLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7U0FDdkIsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFOzs7OztvQkFDOUIsQ0FBQyxHQUFHLElBQUksa0JBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUM1QyxxQkFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUE7O29CQUFaLFNBQVksQ0FBQztvQkFDYixNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7O1NBQ2xDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTs7Ozs7b0JBQ3pDLENBQUMsR0FBRyxJQUFJLGtCQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztvQkFDM0MscUJBQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFBOztvQkFBWixTQUFZLENBQUM7b0JBQ2IsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7OztTQUN6QyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7Ozs7O29CQUMzQyxDQUFDLEdBQUcsSUFBSSxrQkFBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7b0JBQ2hELHFCQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQTs7b0JBQVosU0FBWSxDQUFDO29CQUNiLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Ozs7U0FDekMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==
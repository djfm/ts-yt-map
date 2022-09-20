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
var lib_1 = require("../../lib");
var server_1 = require("../../lib/server");
var api_1 = require("../../lib/api");
var client_1 = __importDefault(require("../../lib/client"));
var password = 'secret';
var cfg;
var server;
var serverURL;
var client;
var log;
var api;
jest.setTimeout(300000);
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, res;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, lib_1.loadServerConfig)(password)];
            case 1:
                cfg = _d.sent();
                serverURL = "http://localhost:".concat(cfg.port);
                return [4 /*yield*/, (0, lib_1.createLogger)()];
            case 2:
                log = _d.sent();
                api = new api_1.API(log, serverURL, password);
                client = new client_1["default"](log, api);
                return [4 /*yield*/, (0, server_1.startServer)(cfg, log)];
            case 3:
                server = _d.sent();
                _b = (_a = api).createClient;
                _c = {
                    name: 'test',
                    seed: 'https://www.youtube.com/watch?v=HqsIOTEbriY'
                };
                return [4 /*yield*/, api.getIP()];
            case 4:
                _b.apply(_a, [(_c.ip = _d.sent(),
                        _c.city = 'test',
                        _c.country = 'TE',
                        _c)]);
                log.info('Removing all recommendations from server before tests...');
                return [4 /*yield*/, api.forTestingClearDb()];
            case 5:
                res = _d.sent();
                res.queries.forEach(function (q) { return log.info(q); });
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!server) return [3 /*break*/, 2];
                return [4 /*yield*/, server.close()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                log.close();
                return [2 /*return*/];
        }
    });
}); });
describe.only('the server basic behaviour', function () {
    it('should get its IP', function () { return __awaiter(void 0, void 0, void 0, function () {
        var ip;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getIP()];
                case 1:
                    ip = _a.sent();
                    log.info(ip);
                    expect(ip.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get a URL to crawl from the server', function () { return __awaiter(void 0, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.getUrlToCrawl()];
                case 1:
                    url = _a.sent();
                    expect(url.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should scrape one video and its recommendations', function () { return __awaiter(void 0, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.scrapeOneVideoAndItsRecommendations()];
                case 1:
                    resp = _a.sent();
                    expect(resp.ok).toBe(true);
                    expect(resp.count).toBe(10);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyX3Rlc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL19fdGVzdHNfXy9pbnRlZ3JhdGlvbi9zZXJ2ZXJfdGVzdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBMEY7QUFDMUYsMkNBQTZEO0FBQzdELHFDQUFvQztBQUNwQyw0REFBc0M7QUFFdEMsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQzFCLElBQUksR0FBaUIsQ0FBQztBQUN0QixJQUFJLE1BQW9CLENBQUM7QUFDekIsSUFBSSxTQUFpQixDQUFDO0FBQ3RCLElBQUksTUFBYyxDQUFDO0FBQ25CLElBQUksR0FBb0IsQ0FBQztBQUN6QixJQUFJLEdBQVEsQ0FBQztBQUViLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFeEIsU0FBUyxDQUFDOzs7OztvQkFDRixxQkFBTSxJQUFBLHNCQUFnQixFQUFDLFFBQVEsQ0FBQyxFQUFBOztnQkFBdEMsR0FBRyxHQUFHLFNBQWdDLENBQUM7Z0JBQ3ZDLFNBQVMsR0FBRywyQkFBb0IsR0FBRyxDQUFDLElBQUksQ0FBRSxDQUFDO2dCQUNyQyxxQkFBTSxJQUFBLGtCQUFZLEdBQUUsRUFBQTs7Z0JBQTFCLEdBQUcsR0FBRyxTQUFvQixDQUFDO2dCQUMzQixHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxHQUFHLElBQUksbUJBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLHFCQUFNLElBQUEsb0JBQVcsRUFBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUE7O2dCQUFwQyxNQUFNLEdBQUcsU0FBMkIsQ0FBQztnQkFDckMsS0FBQSxDQUFBLEtBQUEsR0FBRyxDQUFBLENBQUMsWUFBWSxDQUFBOztvQkFDZCxJQUFJLEVBQUUsTUFBTTtvQkFDWixJQUFJLEVBQUUsNkNBQTZDOztnQkFDL0MscUJBQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFBOztnQkFIdkIsZUFHRSxLQUFFLEdBQUUsU0FBaUI7d0JBQ3JCLE9BQUksR0FBRSxNQUFNO3dCQUNaLFVBQU8sR0FBRSxJQUFJOzZCQUNiLENBQUM7Z0JBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQywwREFBMEQsQ0FBQyxDQUFDO2dCQUN6RCxxQkFBTSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBQTs7Z0JBQW5DLEdBQUcsR0FBRyxTQUE2QjtnQkFDekMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVcsQ0FBQyxDQUFDOzs7O0tBQ3pDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQzs7OztxQkFDSCxNQUFNLEVBQU4sd0JBQU07Z0JBQ1IscUJBQU0sTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFBOztnQkFBcEIsU0FBb0IsQ0FBQzs7O2dCQUd2QixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7Ozs7S0FDYixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFO0lBQzFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTs7Ozt3QkFDWCxxQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUE7O29CQUF0QixFQUFFLEdBQUcsU0FBaUI7b0JBQzVCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7U0FDdEMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFOzs7O3dCQUNsQyxxQkFBTSxHQUFHLENBQUMsYUFBYSxFQUFFLEVBQUE7O29CQUEvQixHQUFHLEdBQUcsU0FBeUI7b0JBQ3JDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O1NBQ3ZDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTs7Ozt3QkFDdkMscUJBQU0sTUFBTSxDQUFDLG1DQUFtQyxFQUFFLEVBQUE7O29CQUF6RCxJQUFJLEdBQUcsU0FBa0Q7b0JBQy9ELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs7OztTQUM3QixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9
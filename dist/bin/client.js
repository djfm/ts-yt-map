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
exports.__esModule = true;
var api_1 = require("../lib/api");
var client_1 = require("../lib/client");
var lib_1 = require("../lib");
var util_1 = require("../util");
// for the experimental fetch API
process.removeAllListeners('warning');
var server = process.env.SERVER;
var password = process.env.SERVER_PASSWORD;
if (typeof server !== 'string') {
    // eslint-disable-next-line no-console
    console.error('Missing SERVER environment variable');
    process.exit(1);
}
if (typeof password !== 'string') {
    // eslint-disable-next-line no-console
    console.error('Missing SERVER_PASSWORD environment variable');
    process.exit(1);
}
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var log, api, client, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, lib_1.createLogger)()];
            case 1:
                log = _a.sent();
                log.info("Starting client, connecting to server ".concat(server, " with password ").concat(password, "..."));
                api = new api_1.API(log, server, password);
                client = new client_1.Client(log, api);
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 6]);
                log.info('Scraping one video and its recommendations...');
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, client.scrapeOneVideoAndItsRecommendations()];
            case 3:
                // eslint-disable-next-line no-await-in-loop
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                e_1 = _a.sent();
                log.error(e_1);
                // eslint-disable-next-line no-await-in-loop
                return [4 /*yield*/, (0, util_1.sleep)(5000)];
            case 5:
                // eslint-disable-next-line no-await-in-loop
                _a.sent();
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 2];
            case 7: return [2 /*return*/];
        }
    });
}); };
main().then(function () { process.exit(0); }, function (err) { return __awaiter(void 0, void 0, void 0, function () {
    var log;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, lib_1.createLogger)()];
            case 1:
                log = _a.sent();
                log.error(err.message);
                log.error(err.stack);
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jpbi9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrQ0FBaUM7QUFDakMsd0NBQXVDO0FBQ3ZDLDhCQUFzQztBQUN0QyxnQ0FBZ0M7QUFFaEMsaUNBQWlDO0FBQ2pDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUV0QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztBQUNsQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztBQUU3QyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtJQUM5QixzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDakI7QUFFRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtJQUNoQyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0lBQzlELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDakI7QUFFRCxJQUFNLElBQUksR0FBRzs7OztvQkFDQyxxQkFBTSxJQUFBLGtCQUFZLEdBQUUsRUFBQTs7Z0JBQTFCLEdBQUcsR0FBRyxTQUFvQjtnQkFDaEMsR0FBRyxDQUFDLElBQUksQ0FBQyxnREFBeUMsTUFBTSw0QkFBa0IsUUFBUSxRQUFLLENBQUMsQ0FBQztnQkFDbkYsR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Ozs7Z0JBSWhDLEdBQUcsQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQztnQkFDMUQsNENBQTRDO2dCQUM1QyxxQkFBTSxNQUFNLENBQUMsbUNBQW1DLEVBQUUsRUFBQTs7Z0JBRGxELDRDQUE0QztnQkFDNUMsU0FBa0QsQ0FBQzs7OztnQkFFbkQsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsQ0FBQztnQkFDYiw0Q0FBNEM7Z0JBQzVDLHFCQUFNLElBQUEsWUFBSyxFQUFDLElBQUksQ0FBQyxFQUFBOztnQkFEakIsNENBQTRDO2dCQUM1QyxTQUFpQixDQUFDOzs7Ozs7S0FHdkIsQ0FBQztBQUVGLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBTyxHQUFHOzs7O29CQUNwQyxxQkFBTSxJQUFBLGtCQUFZLEdBQUUsRUFBQTs7Z0JBQTFCLEdBQUcsR0FBRyxTQUFvQjtnQkFDaEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O0tBQ2pCLENBQUMsQ0FBQyJ9
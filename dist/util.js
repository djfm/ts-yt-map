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
exports.MockLogger = exports.isFile = exports.question = exports.sleep = exports.convertNumber = void 0;
var readline_1 = __importDefault(require("readline"));
var promises_1 = require("fs/promises");
/* eslint-disable import/prefer-default-export */
var convertNumber = function (str) {
    var expanded = str.replace(/,/g, '');
    if (expanded.endsWith('K')) {
        return Math.round(+expanded.slice(0, -1) * 1000);
    }
    if (expanded.endsWith('M')) {
        return Math.round(+expanded.slice(0, -1) * 1000000);
    }
    return Math.round(+expanded);
};
exports.convertNumber = convertNumber;
var sleep = function (ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
};
exports.sleep = sleep;
var question = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
    var rl;
    return __generator(this, function (_a) {
        rl = readline_1["default"].createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return [2 /*return*/, new Promise(function (resolve) {
                rl.question(prompt, function (answer) {
                    rl.close();
                    resolve(answer);
                });
            })];
    });
}); };
exports.question = question;
var isFile = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, promises_1.stat)(path)];
            case 1:
                stats = _a.sent();
                return [2 /*return*/, stats.isFile()];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.isFile = isFile;
var MockLogger = /** @class */ (function () {
    function MockLogger() {
    }
    MockLogger.prototype.error = function () {
        return undefined;
    };
    MockLogger.prototype.info = function () {
        return undefined;
    };
    MockLogger.prototype.debug = function () {
        return undefined;
    };
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    MockLogger.prototype.close = function () { };
    MockLogger.prototype.getRootDirectory = function () {
        return '/tmp';
    };
    return MockLogger;
}());
exports.MockLogger = MockLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyx3Q0FBbUM7QUFJbkMsaURBQWlEO0FBQzFDLElBQU0sYUFBYSxHQUFHLFVBQUMsR0FBVztJQUN2QyxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV2QyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNsRDtJQUVELElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0tBQ3JEO0lBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0IsQ0FBQyxDQUFDO0FBWlcsUUFBQSxhQUFhLGlCQVl4QjtBQUVLLElBQU0sS0FBSyxHQUFHLFVBQUMsRUFBVTtJQUM5QixPQUFBLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxJQUFPLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFBdEQsQ0FBc0QsQ0FBQztBQUQ1QyxRQUFBLEtBQUssU0FDdUM7QUFFbEQsSUFBTSxRQUFRLEdBQUcsVUFBTyxNQUFjOzs7UUFDckMsRUFBRSxHQUFHLHFCQUFRLENBQUMsZUFBZSxDQUFDO1lBQ2xDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztZQUNwQixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07U0FDdkIsQ0FBQyxDQUFDO1FBRUgsc0JBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPO2dCQUN6QixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFDLE1BQU07b0JBQ3pCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDWCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLEVBQUM7O0tBQ0osQ0FBQztBQVpXLFFBQUEsUUFBUSxZQVluQjtBQUVLLElBQU0sTUFBTSxHQUFHLFVBQU8sSUFBWTs7Ozs7O2dCQUV2QixxQkFBTSxJQUFBLGVBQUksRUFBQyxJQUFJLENBQUMsRUFBQTs7Z0JBQXhCLEtBQUssR0FBRyxTQUFnQjtnQkFDOUIsc0JBQU8sS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFDOzs7Z0JBRXRCLHNCQUFPLEtBQUssRUFBQzs7OztLQUVoQixDQUFDO0FBUFcsUUFBQSxNQUFNLFVBT2pCO0FBRUY7SUFBQTtJQStCQSxDQUFDO0lBMUJDLDBCQUFLLEdBQUw7UUFDRSxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBTUQseUJBQUksR0FBSjtRQUNFLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFNRCwwQkFBSyxHQUFMO1FBQ0UsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELGdFQUFnRTtJQUNoRSwwQkFBSyxHQUFMLGNBQWUsQ0FBQztJQUVoQixxQ0FBZ0IsR0FBaEI7UUFDRSxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBL0JELElBK0JDO0FBL0JZLGdDQUFVIn0=
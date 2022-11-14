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
exports.MockLogger = exports.isFile = exports.question = exports.sleep = exports.convertNumber = exports.withLock = void 0;
var readline_1 = __importDefault(require("readline"));
var promises_1 = require("fs/promises");
var locks = new Map();
var unstackLock = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var stack, nextFn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stack = locks.get(id);
                if (!stack) {
                    return [2 /*return*/];
                }
                nextFn = stack.shift();
                if (!nextFn) {
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, , 3, 5]);
                return [4 /*yield*/, nextFn()];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, unstackLock(id)];
            case 4:
                _a.sent();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
var withLock = function (id, fn) { return __awaiter(void 0, void 0, void 0, function () {
    var lock;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!locks.has(id)) {
                    locks.set(id, []);
                }
                lock = locks.get(id);
                if (!lock) {
                    throw new Error('Lock is not defined');
                }
                lock.push(fn);
                return [4 /*yield*/, unstackLock(id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.withLock = withLock;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyx3Q0FBbUM7QUFJbkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQXNDLENBQUM7QUFFNUQsSUFBTSxXQUFXLEdBQUcsVUFBTyxFQUFVOzs7OztnQkFDN0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRTVCLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ1Ysc0JBQU87aUJBQ1I7Z0JBRUssTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFN0IsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDWCxzQkFBTztpQkFDUjs7OztnQkFHQyxxQkFBTSxNQUFNLEVBQUUsRUFBQTs7Z0JBQWQsU0FBYyxDQUFDOztvQkFFZixxQkFBTSxXQUFXLENBQUMsRUFBRSxDQUFDLEVBQUE7O2dCQUFyQixTQUFxQixDQUFDOzs7OztLQUV6QixDQUFDO0FBRUssSUFBTSxRQUFRLEdBQUcsVUFBTyxFQUFVLEVBQUUsRUFBdUI7Ozs7O2dCQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtvQkFDbEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQ25CO2dCQUVLLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUUzQixJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNULE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDeEM7Z0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFZCxxQkFBTSxXQUFXLENBQUMsRUFBRSxDQUFD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
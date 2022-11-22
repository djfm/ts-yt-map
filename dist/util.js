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
    var stack, fn;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                stack = locks.get(id);
                if (!stack) {
                    return [2 /*return*/];
                }
                if (stack.queue.length === 0) {
                    return [2 /*return*/];
                }
                if (!!stack.running) return [3 /*break*/, 3];
                fn = stack.queue.shift();
                if (!fn) return [3 /*break*/, 3];
                stack.running = fn();
                return [4 /*yield*/, stack.running];
            case 1:
                _a.sent();
                stack.running = null;
                return [4 /*yield*/, unstackLock(id)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
var withLock = function (id, fn) { return __awaiter(void 0, void 0, void 0, function () {
    var lock;
    return __generator(this, function (_a) {
        if (!locks.has(id)) {
            locks.set(id, { running: null, queue: [] });
        }
        lock = locks.get(id);
        if (!lock) {
            // never happens but makes TS happy
            throw new Error('Lock is not defined');
        }
        lock.queue.push(fn);
        return [2 /*return*/, unstackLock(id)];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUFnQztBQUNoQyx3Q0FBbUM7QUFXbkMsSUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUM7QUFFdEMsSUFBTSxXQUFXLEdBQUcsVUFBTyxFQUFVOzs7OztnQkFDN0IsS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBRTVCLElBQUksQ0FBQyxLQUFLLEVBQUU7b0JBQ1Ysc0JBQU87aUJBQ1I7Z0JBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7b0JBQzVCLHNCQUFPO2lCQUNSO3FCQUVHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBZCx3QkFBYztnQkFDVixFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDM0IsRUFBRSxFQUFGLHdCQUFFO2dCQUNKLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFLENBQUM7Z0JBQ3JCLHFCQUFNLEtBQUssQ0FBQyxPQUFPLEVBQUE7O2dCQUFuQixTQUFtQixDQUFDO2dCQUNwQixLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDckIscUJBQU0sV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFBOztnQkFBckIsU0FBcUIsQ0FBQzs7Ozs7S0FHM0IsQ0FBQztBQUVLLElBQU0sUUFBUSxHQUFHLFVBQU8sRUFBVSxFQUFFLEVBQVc7OztRQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNsQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFD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
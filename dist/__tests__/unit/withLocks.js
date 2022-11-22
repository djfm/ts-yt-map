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
var util_1 = require("../../util");
describe('the "withLock" function', function () {
    it('allows to run sequentially parallel requests', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results, f1, f2, f3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    results = [];
                    f1 = (0, util_1.withLock)('lock', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, util_1.sleep)(Math.random() * 100)];
                                case 1:
                                    _a.sent();
                                    results.push(1);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    f2 = (0, util_1.withLock)('lock', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, util_1.sleep)(Math.random() * 100)];
                                case 1:
                                    _a.sent();
                                    results.push(2);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    f3 = (0, util_1.withLock)('lock', function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, util_1.sleep)(Math.random() * 100)];
                                case 1:
                                    _a.sent();
                                    results.push(3);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all([f1, f2, f3])];
                case 1:
                    _a.sent();
                    expect(results).toEqual([1, 2, 3]);
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aExvY2tzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL19fdGVzdHNfXy91bml0L3dpdGhMb2Nrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUE2QztBQUU3QyxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsRUFBRSxDQUFDLDhDQUE4QyxFQUFFOzs7OztvQkFDM0MsT0FBTyxHQUFhLEVBQUUsQ0FBQztvQkFFdkIsRUFBRSxHQUFHLElBQUEsZUFBUSxFQUFDLE1BQU0sRUFBRTs7O3dDQUMxQixxQkFBTSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUE7O29DQUFoQyxTQUFnQyxDQUFDO29DQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O3lCQUNqQixDQUFDLENBQUM7b0JBRUcsRUFBRSxHQUFHLElBQUEsZUFBUSxFQUFDLE1BQU0sRUFBRTs7O3dDQUMxQixxQkFBTSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUE7O29DQUFoQyxTQUFnQyxDQUFDO29DQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O3lCQUNqQixDQUFDLENBQUM7b0JBRUcsRUFBRSxHQUFHLElBQUEsZUFBUSxFQUFDLE1BQU0sRUFBRTs7O3dDQUMxQixxQkFBTSxJQUFBLFlBQUssRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUE7O29DQUFoQyxTQUFnQyxDQUFDO29DQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7O3lCQUNqQixDQUFDLENBQUM7b0JBRUgscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBQTs7b0JBQS9CLFNBQStCLENBQUM7b0JBRWhDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7U0FDcEMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==
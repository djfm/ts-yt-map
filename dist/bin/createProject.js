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
var promises_1 = require("fs/promises");
var lib_1 = require("../lib");
var api_1 = require("../lib/api");
var client_1 = require("../lib/client");
var project_1 = require("../models/project");
var util_1 = require("../util");
var server = process.argv[2];
var password = process.argv[3];
var urlsPath = process.argv[4];
var usage = function () {
    // eslint-disable-next-line no-console
    console.error('Usage: createProject <server> <password> <urls file: text file with one URL per line and no header>');
    process.exit(1);
};
if (typeof server !== 'string' || typeof password !== 'string' || typeof urlsPath !== 'string') {
    usage();
}
// eslint-disable-next-line no-console
console.log('Server:', server);
// eslint-disable-next-line no-console
console.log('Password:', password);
var loadURLs = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var data, lines, _i, lines_1, line;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readFile)(path, 'utf8')];
            case 1:
                data = _a.sent();
                lines = data.split('\n').filter(function (line) { return line.length > 0; });
                for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    line = lines_1[_i];
                    try {
                        // eslint-disable-next-line no-new
                        new URL(line);
                    }
                    catch (e) {
                        throw new Error("Invalid URL: ".concat(line));
                    }
                }
                return [2 /*return*/, lines];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var log, cfg, clientSettings, api, payload, _a, _b, _c, project;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, util_1.isFile)(urlsPath)];
            case 1:
                if (!(_d.sent())) {
                    // eslint-disable-next-line no-console
                    console.error("File ".concat(urlsPath, " does not exist"));
                    process.exit(1);
                }
                return [4 /*yield*/, (0, lib_1.createLogger)()];
            case 2:
                log = _d.sent();
                // just remove a warning, we don't care about it
                process.env.node_env = 'production';
                return [4 /*yield*/, (0, lib_1.loadConfig)(password)];
            case 3:
                cfg = _d.sent();
                clientSettings = new client_1.ClientSettings(cfg.client_name, cfg.seed_video, -1);
                api = new api_1.API(log, server, password, clientSettings);
                payload = new project_1.CreateProjectPayload();
                _a = payload;
                return [4 /*yield*/, (0, util_1.question)('Project name: ')];
            case 4:
                _a.name = _d.sent();
                _b = payload;
                return [4 /*yield*/, (0, util_1.question)('Project description: ')];
            case 5:
                _b.description = _d.sent();
                _c = payload;
                return [4 /*yield*/, loadURLs(urlsPath)];
            case 6:
                _c.urls = _d.sent();
                return [4 /*yield*/, api.createProject(payload)];
            case 7:
                project = _d.sent();
                // eslint-disable-next-line no-console
                console.log('Successfully created project', project);
                return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vY3JlYXRlUHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHdDQUF1QztBQUV2Qyw4QkFBa0Q7QUFDbEQsa0NBQWlDO0FBQ2pDLHdDQUErQztBQUMvQyw2Q0FBeUQ7QUFDekQsZ0NBQTJDO0FBRTNDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWpDLElBQU0sS0FBSyxHQUFHO0lBQ1osc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMscUdBQXFHLENBQUMsQ0FBQztJQUNySCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUVGLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7SUFDOUYsS0FBSyxFQUFFLENBQUM7Q0FDVDtBQUVELHNDQUFzQztBQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQixzQ0FBc0M7QUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFbkMsSUFBTSxRQUFRLEdBQUcsVUFBTyxJQUFZOzs7O29CQUNyQixxQkFBTSxJQUFBLG1CQUFRLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFBOztnQkFBbkMsSUFBSSxHQUFHLFNBQTRCO2dCQUNuQyxLQUFL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
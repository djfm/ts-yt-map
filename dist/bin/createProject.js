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
var lib_1 = require("../lib");
var api_1 = require("../lib/api");
var client_1 = require("../lib/client");
var project_1 = require("../models/project");
var server = process.argv[2];
var password = process.argv[3];
if (typeof server !== 'string') {
    // eslint-disable-next-line no-console
    console.error('Usage: createProject <server> <password>');
    process.exit(1);
}
if (typeof password !== 'string') {
    // eslint-disable-next-line no-console
    console.error('Usage: createProject <server> <password>');
    process.exit(1);
}
// eslint-disable-next-line no-console
console.log('Server:', server);
// eslint-disable-next-line no-console
console.log('Password:', password);
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var log, cfg, clientSettings, api, payload, project;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, lib_1.createLogger)()];
            case 1:
                log = _a.sent();
                return [4 /*yield*/, (0, lib_1.loadConfig)(password)];
            case 2:
                cfg = _a.sent();
                clientSettings = new client_1.ClientSettings(cfg.client_name, cfg.seed_video, -1);
                api = new api_1.API(log, server, password, clientSettings);
                payload = new project_1.CreateProjectPayload();
                payload.name = 'test project name';
                payload.description = 'test project description';
                payload.urls = ['https://www.youtube.com/watch?v=9bZkp7q19f0', 'test url 2'];
                return [4 /*yield*/, api.createProject(payload)];
            case 3:
                project = _a.sent();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iaW4vY3JlYXRlUHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhCQUFrRDtBQUNsRCxrQ0FBaUM7QUFDakMsd0NBQStDO0FBQy9DLDZDQUF5RDtBQUV6RCxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFakMsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7SUFDOUIsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2pCO0FBRUQsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7SUFDaEMsc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUMxRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2pCO0FBRUQsc0NBQXNDO0FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLHNDQUFzQztBQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUVuQyxJQUFNLElBQUksR0FBRzs7OztvQkFDQyxxQkFBTSxJQUFBLGtCQUFZLEdBQUUsRUFBQTs7Z0JBQTFCLEdBQUcsR0FBRyxTQUFvQjtnQkFDcEIscUJBQU0sSUFBQSxnQkFBVSxFQUFDLFFBQVEsQ0FBQyxFQUFBOztnQkFBaEMsR0FBRyxHQUFHLFNBQTBCO2dCQUVoQyxjQUFjLEdBQUcsSUFBSSx1QkFBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBRXJELE9BQU8sR0FBRyxJQUFJLDhCQUFvQixFQUFFLENBQUM7Z0JBRTNDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxXQUFXLEdBQUcsMEJBQTBCLENBQUM7Z0JBQ2pELE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyw2Q0FBNkMsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFFN0QscUJBQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBQTs7Z0JBQTFDLE9BQU8sR0FBRyxTQUFnQztnQkFFaEQsc0NBQXNDO2dCQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7O0tBQ3RELENBQUM7QUFFRixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBUSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQU8sR0FBRzs7OztvQkFDcEMscUJBQU0sSUFBQSxrQkFBWSxHQUFFLEVBQUE7O2dCQUExQixHQUFHLEdBQUcsU0FBb0I7Z0JBQ2hDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztLQUNqQixDQUFDLENBQUMifQ==
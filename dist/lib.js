"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.loadServerConfig = exports.loadChromeConfig = exports.createLogger = exports.ServerConfig = exports.Browser = void 0;
var path_1 = require("path");
var promises_1 = require("fs/promises");
var pino_1 = __importDefault(require("pino"));
var yaml_1 = require("yaml");
var class_validator_1 = require("class-validator");
var browser_1 = require("./browser");
var browser_2 = require("./browser");
__createBinding(exports, browser_2, "Browser");
var DbConfig = /** @class */ (function () {
    function DbConfig() {
        this.host = '';
        this.port = 0;
        this.username = '';
        this.password = '';
        this.database = '';
    }
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        __metadata("design:type", Object)
    ], DbConfig.prototype, "host");
    __decorate([
        (0, class_validator_1.Min)(1),
        (0, class_validator_1.Max)(65535),
        __metadata("design:type", Object)
    ], DbConfig.prototype, "port");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        __metadata("design:type", Object)
    ], DbConfig.prototype, "username");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        __metadata("design:type", Object)
    ], DbConfig.prototype, "password");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        __metadata("design:type", Object)
    ], DbConfig.prototype, "database");
    return DbConfig;
}());
var ServerConfig = /** @class */ (function () {
    function ServerConfig(config) {
        this.password = '';
        this.port = 0;
        this.host = '';
        this.db = new DbConfig();
        this.seed_video = '';
        Object.assign(this, config);
    }
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        __metadata("design:type", String)
    ], ServerConfig.prototype, "password");
    __decorate([
        (0, class_validator_1.Min)(1),
        (0, class_validator_1.Max)(65535),
        __metadata("design:type", Object)
    ], ServerConfig.prototype, "port");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        __metadata("design:type", String)
    ], ServerConfig.prototype, "host");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        __metadata("design:type", Object)
    ], ServerConfig.prototype, "seed_video");
    return ServerConfig;
}());
exports.ServerConfig = ServerConfig;
var logDir = new Date().toISOString();
var createLogger = function () { return __awaiter(void 0, void 0, void 0, function () {
    var logRoot, logger;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logRoot = (0, path_1.join)(__dirname, '..', 'logs', logDir);
                return [4 /*yield*/, (0, promises_1.mkdir)(logRoot, { recursive: true })];
            case 1:
                _a.sent();
                logger = (0, pino_1["default"])({
                    enabled: true,
                    name: 'ts-yt-map',
                    transport: {
                        target: 'pino-pretty',
                        options: {
                            colorize: true
                        }
                    }
                });
                logger.level = 'debug';
                return [2 /*return*/, Object.assign(logger, {
                        getRootDirectory: function () { return logRoot; },
                        close: function () { return null; }
                    })];
        }
    });
}); };
exports.createLogger = createLogger;
var loadChromeConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var configPath, config, _a, chromeConfig;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                configPath = (0, path_1.join)(__dirname, '..', 'config', 'chrome.yaml');
                _a = yaml_1.parse;
                return [4 /*yield*/, (0, promises_1.readFile)(configPath, 'utf8')];
            case 1:
                config = _a.apply(void 0, [_b.sent()]);
                chromeConfig = new browser_1.ChromeConfig(config);
                return [4 /*yield*/, (0, class_validator_1.validate)(chromeConfig)];
            case 2:
                _b.sent();
                return [2 /*return*/, chromeConfig];
        }
    });
}); };
exports.loadChromeConfig = loadChromeConfig;
var getServerConfigFileName = function () {
    if (process.env.NODE_ENV === 'production') {
        return 'production.yaml';
    }
    if (process.env.NODE_ENV === 'test-docker') {
        return 'test-docker.yaml';
    }
    if (process.env.NODE_ENV === 'production-docker') {
        return 'production-docker.yaml';
    }
    if (process.env.NODE_ENV === 'integration') {
        return 'integration.yaml';
    }
    return 'test.yaml';
};
var loadServerConfig = function (serverPassword) {
    if (serverPassword === void 0) { serverPassword = process.env.SERVER_PASSWORD; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fname, log, configPath, config, _a, serverConfig;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fname = getServerConfigFileName();
                    return [4 /*yield*/, (0, exports.createLogger)()];
                case 1:
                    log = _b.sent();
                    if (!serverPassword) {
                        log.error('No server password provided');
                        process.exit(1);
                    }
                    if (process.env.NODE_ENV !== 'test' && fname === 'test.yaml') {
                        log.error("Loading config from ".concat(fname, " by default. This may be a mistake."));
                    }
                    log.info("Loading server config from ".concat(fname));
                    configPath = (0, path_1.join)(__dirname, '..', 'config', fname);
                    _a = yaml_1.parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(configPath, 'utf8')];
                case 2:
                    config = _a.apply(void 0, [_b.sent()]);
                    config.password = serverPassword;
                    serverConfig = new ServerConfig(config);
                    log.close();
                    return [2 /*return*/, serverConfig];
            }
        });
    });
};
exports.loadServerConfig = loadServerConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUM1Qix3Q0FBOEM7QUFFOUMsOENBQXdCO0FBRXhCLDZCQUEwQztBQUMxQyxtREFBNkQ7QUFDN0QscUNBQXlDO0FBRXpDLHFDQUVtQjtBQURqQiwrQ0FBTztBQWlCVDtJQUFBO1FBRVMsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUlWLFNBQUksR0FBRyxDQUFDLENBQUM7UUFHVCxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBR2QsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUdkLGFBQVEsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQWZDO1FBQUMsSUFBQSx3QkFBTSxFQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7O2tDQUNFO0lBRWpCO1FBQUMsSUFBQSxxQkFBRyxFQUFDLENBQUMsQ0FBQztRQUNOLElBQUEscUJBQUcsRUFBQyxLQUFLLENBQUM7O2tDQUNLO0lBRWhCO1FBQUMsSUFBQSx3QkFBTSxFQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7O3NDQUNNO0lBRXJCO1FBQUMsSUFBQSx3QkFBTSxFQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7O3NDQUNNO0lBRXJCO1FBQUMsSUFBQSx3QkFBTSxFQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7O3NDQUNNO0lBQ3ZCLGVBQUM7Q0FBQSxBQWhCRCxJQWdCQztBQUVEO0lBZ0JFLHNCQUFZLE1BQStCO1FBZHBDLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFJdEIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUdULFNBQUksR0FBVSxFQUFFLENBQUM7UUFFakIsT0FBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFHcEIsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUdyQixNQUFNLENB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
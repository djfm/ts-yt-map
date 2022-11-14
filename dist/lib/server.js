"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.startServer = void 0;
var pg_1 = require("pg");
var postgres_migrations_1 = require("postgres-migrations");
var typeorm_1 = require("typeorm");
var typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
var class_validator_1 = require("class-validator");
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var geoip_lite_1 = __importDefault(require("geoip-lite"));
var video_1 = require("../models/video");
var channel_1 = require("../models/channel");
var client_1 = require("../models/client");
var recommendation_1 = require("../models/recommendation");
var scraper_1 = require("../scraper");
var v1_1 = require("../endpoints/v1");
var asError = function (e) {
    if (e instanceof Error) {
        return e;
    }
    return new Error('Unknown error');
};
var countingRecommendationsSince = Date.now();
var recommendationsSaved = 0;
var sentURLsToCrawl = new Set();
var startServer = function (cfg, log) { return __awaiter(void 0, void 0, void 0, function () {
    var pg, e_1, e_2, ds, getVideoToCrawl, getOrCreateClient, saveChannelAndGetId, saveVideo, app, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pg = new pg_1.Client(__assign(__assign({}, cfg.db), { user: cfg.db.username }));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pg.connect()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                log.error('Failed to connect to database', { error: e_1 });
                throw e_1;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, (0, postgres_migrations_1.migrate)({ client: pg }, 'data/migrations')];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                e_2 = _a.sent();
                log.error('Failed to migrate database', { error: e_2 });
                throw e_2;
            case 7:
                ds = new typeorm_1.DataSource(__assign(__assign({ type: 'postgres' }, cfg.db), { synchronize: false, entities: [video_1.Video, channel_1.Channel, recommendation_1.Recommendation, client_1.Client], namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy() }));
                return [4 /*yield*/, ds.initialize()];
            case 8:
                _a.sent();
                getVideoToCrawl = function (client) { return __awaiter(void 0, void 0, void 0, function () {
                    var resp;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ds.transaction(function (manager) { return __awaiter(void 0, void 0, void 0, function () {
                                    var video;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, manager.findOne(video_1.Video, {
                                                    where: {
                                                        crawled: false,
                                                        crawlAttemptCount: (0, typeorm_1.LessThan)(4),
                                                        latestCrawlAttemptedAt: (0, typeorm_1.LessThan)(new Date(Date.now() - 1000 * 60 * 10)),
                                                        clientId: client.id
                                                    },
                                                    order: { url: 'ASC' }
                                                })];
                                            case 1:
                                                video = _a.sent();
                                                if (!video) return [3 /*break*/, 3];
                                                video.latestCrawlAttemptedAt = new Date();
                                                video.crawlAttemptCount += 1;
                                                return [4 /*yield*/, manager.save(video)];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/, { ok: true, url: video.url }];
                                            case 3:
                                                if (client.seed) {
                                                    return [2 /*return*/, { ok: true, url: client.seed }];
                                                }
                                                return [2 /*return*/, { ok: false }];
                                        }
                                    });
                                }); })];
                            case 1:
                                resp = _a.sent();
                                return [2 /*return*/, resp];
                        }
                    });
                }); };
                getOrCreateClient = function (name, ip, seed) { return __awaiter(void 0, void 0, void 0, function () {
                    var client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ds.transaction(function (manager) { return __awaiter(void 0, void 0, void 0, function () {
                                    var client, newClient, geo;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, manager.findOneBy(client_1.Client, { ip: ip, name: name })];
                                            case 1:
                                                client = _a.sent();
                                                if (client) {
                                                    return [2 /*return*/, client];
                                                }
                                                newClient = new client_1.Client({ ip: ip, name: name });
                                                geo = geoip_lite_1["default"].lookup(ip);
                                                if (geo) {
                                                    newClient.country = geo.country;
                                                    newClient.city = geo.city;
                                                }
                                                else {
                                                    log.info('Failed to lookup geoip', { ip: ip });
                                                    newClient.country = 'Unknown';
                                                    newClient.city = 'Unknown';
                                                }
                                                newClient.name = name;
                                                newClient.seed = seed;
                                                return [2 /*return*/, manager.save(newClient)];
                                        }
                                    });
                                }); })];
                            case 1:
                                client = _a.sent();
                                return [2 /*return*/, client];
                        }
                    });
                }); };
                saveChannelAndGetId = function (repo, channel) { return __awaiter(void 0, void 0, void 0, function () {
                    var currentChannel, newChannel, newChannelErrors, savedChannel;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, repo.findOneBy(channel_1.Channel, {
                                    youtubeId: channel.youtubeId
                                })];
                            case 1:
                                currentChannel = _a.sent();
                                if (currentChannel) {
                                    return [2 /*return*/, currentChannel.id];
                                }
                                newChannel = new channel_1.Channel(channel);
                                return [4 /*yield*/, (0, class_validator_1.validate)(newChannel)];
                            case 2:
                                newChannelErrors = _a.sent();
                                if (newChannelErrors.length > 0) {
                                    log.error('Failed to save channel');
                                    log.error(newChannelErrors);
                                    throw new Error('Failed to save channel');
                                }
                                return [4 /*yield*/, repo.save(newChannel)];
                            case 3:
                                savedChannel = _a.sent();
                                return [2 /*return*/, savedChannel.id];
                        }
                    });
                }); };
                saveVideo = function (em, video, projectId) { return __awaiter(void 0, void 0, void 0, function () {
                    var channelId, videoEntity, videoErrors, msg, saved, newVideo;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!video.channel) {
                                    throw new Error('Video must have a channel');
                                }
                                return [4 /*yield*/, saveChannelAndGetId(em, video.channel)];
                            case 1:
                                channelId = _a.sent();
                                videoEntity = new video_1.Video(video);
                                videoEntity.channelId = channelId;
                                videoEntity.projectId = projectId;
                                return [4 /*yield*/, (0, class_validator_1.validate)(videoEntity)];
                            case 2:
                                videoErrors = _a.sent();
                                if (videoErrors.length > 0) {
                                    msg = "Invalid video: ".concat(JSON.stringify(videoErrors));
                                    log.error(msg, { video: video });
                                    throw new Error(msg);
                                }
                                return [4 /*yield*/, em.findOneBy(video_1.Video, { url: videoEntity.url })];
                            case 3:
                                saved = _a.sent();
                                if (saved) {
                                    return [2 /*return*/, saved];
                                }
                                return [4 /*yield*/, em.save(videoEntity)];
                            case 4:
                                newVideo = _a.sent();
                                return [2 /*return*/, newVideo];
                        }
                    });
                }); };
                app = (0, express_1["default"])();
                app.set('view engine', 'pug');
                app.set('views', './views');
                app.use(body_parser_1["default"].json());
                app.use(body_parser_1["default"].urlencoded({ extended: true }));
                app.get(v1_1.GETPing, function (req, res) {
                    res.json({ pong: true });
                });
                app.post(v1_1.POSTGetUrlToCrawl, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var ip, _a, seed_video, client_name, client, u;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                log.debug('Getting video to crawl...');
                                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                if (typeof ip !== 'string') {
                                    res.status(500).json({ message: 'Invalid IP address', ip: ip });
                                    return [2 /*return*/];
                                }
                                _a = req.body, seed_video = _a.seed_video, client_name = _a.client_name;
                                // eslint-disable-next-line camelcase
                                if (!seed_video || !(typeof seed_video === 'string')) {
                                    res.status(400).json({ ok: false, message: 'Missing seed video' });
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, getOrCreateClient(client_name, ip, seed_video)];
                            case 1:
                                client = _b.sent();
                                return [4 /*yield*/, getVideoToCrawl(client)];
                            case 2:
                                u = _b.sent();
                                if (u.ok) {
                                    if (sentURLsToCrawl.has(u.url)) {
                                        log.info("Already sent ".concat(u.url, " to a client"));
                                        res.status(500).json({ ok: false, message: 'URL already sent to parse' });
                                        return [2 /*return*/];
                                    }
                                    sentURLsToCrawl.add(u.url);
                                    setTimeout(function () {
                                        sentURLsToCrawl["delete"](u.url);
                                    }, 1000 * 60 * 15);
                                    log.info("Sent video to crawl ".concat(u.url, " to ").concat(ip, " (client with id ").concat(client.id, ")"));
                                    res.status(200).json(u);
                                }
                                else {
                                    log.info("No video to crawl for ".concat(ip));
                                    res.status(503).json(u);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                app.post(v1_1.POSTResetTimingForTesting, function (req, res) {
                    countingRecommendationsSince = Date.now();
                    recommendationsSaved = 0;
                    res.status(200).json({ ok: true });
                });
                app.post(v1_1.POSTRecommendation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var ip, data, errors, clientManager, client, videoRepo, from, recommendations, error_1, message;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                if (typeof ip !== 'string') {
                                    res.status(500).json({ ok: false });
                                    return [2 /*return*/];
                                }
                                data = new scraper_1.ScrapedRecommendationData(req.body.client_name, req.body.projectId, req.body.from, req.body.to);
                                return [4 /*yield*/, (0, class_validator_1.validate)(data)];
                            case 1:
                                errors = _a.sent();
                                if (errors.length > 0) {
                                    log.error('Invalid recommendations', { errors: errors });
                                    res.status(400).json({ OK: false, count: 0 });
                                    throw new Error('Error in recommendations data.');
                                }
                                clientManager = ds.manager.getRepository(client_1.Client);
                                return [4 /*yield*/, clientManager.findOneBy({ ip: ip, name: data.client_name })];
                            case 2:
                                client = _a.sent();
                                if (!client) {
                                    res.status(500).json({ ok: false });
                                    return [2 /*return*/];
                                }
                                log.info('Received recommendations to save.');
                                sentURLsToCrawl["delete"](data.from.url);
                                _a.label = 3;
                            case 3:
                                _a.trys.push([3, 8, , 9]);
                                videoRepo = ds.getRepository(video_1.Video);
                                return [4 /*yield*/, videoRepo.findOneBy({ url: data.from.url })];
                            case 4:
                                from = _a.sent();
                                if (!from) return [3 /*break*/, 6];
                                return [4 /*yield*/, ds.getRepository(recommendation_1.Recommendation).findBy({
                                        fromId: from.id
                                    })];
                            case 5:
                                recommendations = _a.sent();
                                if (recommendations.length >= 10) {
                                    log.info('Recommendations already exist.');
                                    res.status(201).json({ ok: true, count: 0 });
                                    return [2 /*return*/];
                                }
                                _a.label = 6;
                            case 6: return [4 /*yield*/, ds.manager.transaction(function (em) { return __awaiter(void 0, void 0, void 0, function () {
                                    var from, saves, elapsed, recommendationsPerMinute;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                data.from.clientId = client.id;
                                                return [4 /*yield*/, saveVideo(em, data.from, data.projectId)];
                                            case 1:
                                                from = _a.sent();
                                                from.crawled = true;
                                                saves = Object.entries(data.to)
                                                    .map(function (_a) {
                                                    var rank = _a[0], video = _a[1];
                                                    return __awaiter(void 0, void 0, void 0, function () {
                                                        var to, recommendation, e_3;
                                                        return __generator(this, function (_b) {
                                                            switch (_b.label) {
                                                                case 0: return [4 /*yield*/, saveVideo(em, __assign(__assign({}, video), { clientId: client.id }), data.projectId)];
                                                                case 1:
                                                                    to = _b.sent();
                                                                    log.info("Saving recommendation from ".concat(from.id, " to ").concat(to.id, " for client ").concat(client.id, " (").concat(client.name, ")"));
                                                                    recommendation = new recommendation_1.Recommendation();
                                                                    recommendation.fromId = from.id;
                                                                    recommendation.toId = to.id;
                                                                    recommendation.createdAt = new Date();
                                                                    recommendation.updatedAt = new Date();
                                                                    recommendation.rank = +rank;
                                                                    _b.label = 2;
                                                                case 2:
                                                                    _b.trys.push([2, 4, , 5]);
                                                                    return [4 /*yield*/, em.save(recommendation)];
                                                                case 3: return [2 /*return*/, _b.sent()];
                                                                case 4:
                                                                    e_3 = _b.sent();
                                                                    log.error("Failed to save recommendation from ".concat(from.id, " to ").concat(to.id, ": ").concat(asError(e_3).message), { e: e_3 });
                                                                    throw e_3;
                                                                case 5: return [2 /*return*/];
                                                            }
                                                        });
                                                    });
                                                });
                                                return [4 /*yield*/, Promise.all(saves)];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, em.save(from)];
                                            case 3:
                                                _a.sent();
                                                recommendationsSaved += data.to.length;
                                                elapsed = (Date.now() - countingRecommendationsSince) / 1000 / 60;
                                                if (elapsed > 0) {
                                                    recommendationsPerMinute = Math.round(recommendationsSaved / elapsed);
                                                    log.info("Saved recommendations per minute: ".concat(recommendationsPerMinute));
                                                    // resetting the average every 10 minutes
                                                    if (elapsed > 10) {
                                                        countingRecommendationsSince = Date.now();
                                                        recommendationsSaved = 0;
                                                    }
                                                }
                                                res.json({ ok: true, count: data.to.length });
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                            case 7:
                                _a.sent();
                                return [3 /*break*/, 9];
                            case 8:
                                error_1 = _a.sent();
                                message = asError(error_1).message;
                                log.error("Could not save recommendations: ".concat(message), { error: error_1 });
                                log.error(error_1);
                                res.status(500).send({ ok: false, message: message });
                                return [3 /*break*/, 9];
                            case 9: return [2 /*return*/];
                        }
                    });
                }); });
                server = app.listen(
                // eslint-disable-next-line no-console
                cfg.port, '0.0.0.0', function () { return log.info("Listening on port ".concat(cfg.port), '0.0.0.0'); });
                app.post(v1_1.POSTClearDbForTesting, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var queries;
                    return __generator(this, function (_a) {
                        queries = [
                            'truncate recommendation cascade',
                            'truncate video cascade',
                            'truncate channel cascade',
                        ];
                        queries.forEach(function (query) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, ds.query(query)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        res.json({ queries: queries });
                        return [2 /*return*/];
                    });
                }); });
                app.get(v1_1.GETRoot, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        res.json({ ok: true });
                        return [2 /*return*/];
                    });
                }); });
                app.get(v1_1.GETIP, function (req, res) {
                    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                    if (typeof ip !== 'string') {
                        var err = "Could not get IP: ".concat(JSON.stringify(ip));
                        log.error(err);
                        res.status(500).json({ message: err });
                        return;
                    }
                    res.json({ ip: ip });
                });
                return [2 /*return*/, {
                        pg: pg,
                        ds: ds,
                        close: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            server.close(function (err) {
                                                if (err) {
                                                    reject(err);
                                                }
                                                else {
                                                    resolve(null);
                                                }
                                            });
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, pg.end()];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }
                    }];
        }
    });
}); };
exports.startServer = startServer;
exports["default"] = exports.startServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBd0M7QUFDeEMsMkRBQThDO0FBQzlDLG1DQUE4RDtBQUM5RCx1RUFBZ0U7QUFDaEUsbURBQTJDO0FBQzNDLG9EQUE4QjtBQUM5Qiw0REFBcUM7QUFFckMsMERBQStCO0FBRS9CLHlDQUEwRDtBQUMxRCw2Q0FBZ0U7QUFDaEUsMkNBQTBDO0FBQzFDLDJEQUEwRDtBQUMxRCxzQ0FBdUQ7QUFFdkQsc0NBUXlCO0FBUXpCLElBQU0sT0FBTyxHQUFHLFVBQUMsQ0FBVTtJQUN6QixJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUU7UUFDdEIsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUNELE9BQU8sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsSUFBSSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDOUMsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7QUFFN0IsSUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztBQUVuQyxJQUFNLFdBQVcsR0FBRyxVQUN6QixHQUFpQixFQUFFLEdBQW9COzs7OztnQkFFakMsRUFBRSxHQUFHLElBQUksV0FBUSx1QkFDbEIsR0FBRyxDQUFDLEVBQUUsS0FDVCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLElBQ3JCLENBQUM7Ozs7Z0JBR0QscUJBQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFBOztnQkFBbEIsU0FBa0IsQ0FBQzs7OztnQkFFbkIsR0FBRyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RCxN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
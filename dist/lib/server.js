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
var video_1 = require("../video");
var channel_1 = require("../channel");
var client_1 = require("../client");
var recommendation_1 = require("../recommendation");
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
                saveVideo = function (em, video) { return __awaiter(void 0, void 0, void 0, function () {
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
                    var ip, client_name, seed_video, client, u;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log.debug('Getting video to crawl...');
                                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                if (typeof ip !== 'string') {
                                    res.status(500).json({ message: 'Invalid IP address', ip: ip });
                                    return [2 /*return*/];
                                }
                                client_name = cfg.client_name;
                                seed_video = req.body.seed_video;
                                // eslint-disable-next-line camelcase
                                if (!seed_video || !(typeof seed_video === 'string')) {
                                    res.status(400).json({ ok: false, message: 'Missing seed video' });
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, getOrCreateClient(client_name, ip, seed_video)];
                            case 1:
                                client = _a.sent();
                                return [4 /*yield*/, getVideoToCrawl(client)];
                            case 2:
                                u = _a.sent();
                                if (u.ok) {
                                    log.info("Sent video to crawl ".concat(u.url, " to ").concat(ip));
                                    res.status(200).json(u);
                                }
                                else {
                                    log.info("No video to crawl for ".concat(ip));
                                    res.status(504).json(u);
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
                    var ip, clientManager, client, data, errors, videoRepo, from, recommendations, error_1, message;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                if (typeof ip !== 'string') {
                                    res.status(500).json({ ok: false });
                                    return [2 /*return*/];
                                }
                                clientManager = ds.manager.getRepository(client_1.Client);
                                return [4 /*yield*/, clientManager.findOneBy({ ip: ip })];
                            case 1:
                                client = _a.sent();
                                if (!client) {
                                    res.status(500).json({ ok: false });
                                    return [2 /*return*/];
                                }
                                data = new scraper_1.ScrapedRecommendation(req.body.from, req.body.to);
                                return [4 /*yield*/, (0, class_validator_1.validate)(data)];
                            case 2:
                                errors = _a.sent();
                                if (errors.length > 0) {
                                    log.error('Invalid recommendations', { errors: errors });
                                    res.status(400).json({ OK: false, count: 0 });
                                    throw new Error('Error in recommendations data.');
                                }
                                log.info('Received recommendations to save.');
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
                                                return [4 /*yield*/, saveVideo(em, data.from)];
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
                                                                case 0: return [4 /*yield*/, saveVideo(em, __assign(__assign({}, video), { clientId: client.id }))];
                                                                case 1:
                                                                    to = _b.sent();
                                                                    log.info("Saving recommendation from ".concat(from.id, " to ").concat(to.id));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBd0M7QUFDeEMsMkRBQThDO0FBQzlDLG1DQUE4RDtBQUM5RCx1RUFBZ0U7QUFDaEUsbURBQTJDO0FBQzNDLG9EQUE4QjtBQUM5Qiw0REFBcUM7QUFFckMsMERBQStCO0FBRS9CLGtDQUFtRDtBQUNuRCxzQ0FBeUQ7QUFDekQsb0NBQW1DO0FBQ25DLG9EQUFtRDtBQUNuRCxzQ0FBbUQ7QUFFbkQsc0NBUXlCO0FBUXpCLElBQU0sT0FBTyxHQUFHLFVBQUMsQ0FBVTtJQUN6QixJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUU7UUFDdEIsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUNELE9BQU8sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsSUFBSSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDOUMsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7QUFFdEIsSUFBTSxXQUFXLEdBQUcsVUFDekIsR0FBaUIsRUFBRSxHQUFvQjs7Ozs7Z0JBRWpDLEVBQUUsR0FBRyxJQUFJLFdBQVEsdUJBQ2xCLEdBQUcsQ0FBQyxFQUFFLEtBQ1QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxJQUNyQixDQUFDOzs7O2dCQUdELHFCQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBQTs7Z0JBQWxCLFNBQWtCLENBQUM7Ozs7Z0JBRW5CLEdBQUcsQ0FBQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDekQsTUFBTSxHQUFDLENBQUM7OztnQkFJUixxQkFBTSxJQUFBLDZCQUFPLEVB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
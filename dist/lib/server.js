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
                                data = new scraper_1.ScrapedRecommendationData(req.body.client_name, req.body.from, req.body.to);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBd0M7QUFDeEMsMkRBQThDO0FBQzlDLG1DQUE4RDtBQUM5RCx1RUFBZ0U7QUFDaEUsbURBQTJDO0FBQzNDLG9EQUE4QjtBQUM5Qiw0REFBcUM7QUFFckMsMERBQStCO0FBRS9CLGtDQUFtRDtBQUNuRCxzQ0FBeUQ7QUFDekQsb0NBQW1DO0FBQ25DLG9EQUFtRDtBQUNuRCxzQ0FBdUQ7QUFFdkQsc0NBUXlCO0FBUXpCLElBQU0sT0FBTyxHQUFHLFVBQUMsQ0FBVTtJQUN6QixJQUFJLENBQUMsWUFBWSxLQUFLLEVBQUU7UUFDdEIsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUNELE9BQU8sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBRUYsSUFBSSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDOUMsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7QUFFN0IsSUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztBQUVuQyxJQUFNLFdBQVcsR0FBRyxVQUN6QixHQUFpQixFQUFFLEdBQW9COzs7OztnQkFFakMsRUFBRSxHQUFHLElBQUksV0FBUSx1QkFDbEIsR0FBRyxDQUFDLEVBQUUsS0FDVCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLElBQ3JCLENBQUM7Ozs7Z0JBR0QscUJBQU0sRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFBOztnQkFBbEIsU0FBa0IsQ0FBQzs7OztnQkFFbkIsR0FBRyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RCxN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
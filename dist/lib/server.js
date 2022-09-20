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
var cookie_parser_1 = __importDefault(require("cookie-parser"));
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
    var pg, e_1, e_2, ds, getVideoToCrawl, saveChannelAndGetId, saveVideo, app, server;
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
                app.use((0, cookie_parser_1["default"])());
                app.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
                    var ip;
                    return __generator(this, function (_a) {
                        log.debug("Authorizing request (password is \"".concat(cfg.password, "\")..."));
                        ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                        if (req.body.password === cfg.password) {
                            log.debug("Authorized request for ".concat(ip, ", setting password in cookie."));
                            res.cookie('password', cfg.password);
                            next();
                            return [2 /*return*/];
                        }
                        if (req.cookies && req.cookies.password === cfg.password) {
                            log.debug("Authorized request for ".concat(ip));
                            next();
                            return [2 /*return*/];
                        }
                        if (req.headers['x-password'] !== cfg.password) {
                            log.error("Invalid password from ".concat(ip, ", got ").concat(req.headers['x-password'], " instead of ").concat(cfg.password));
                            res.status(401).render('unauthorized');
                            return [2 /*return*/];
                        }
                        log.debug('Authorized');
                        next();
                        return [2 /*return*/];
                    });
                }); });
                app.get(v1_1.GETPing, function (req, res) {
                    res.json({ pong: true });
                });
                app.post(v1_1.POSTLogin, function (req, res) {
                    res.redirect(v1_1.GETClient);
                });
                app.get(v1_1.GETClient, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var ip_1, geo_1, client_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(req.cookies && req.cookies.password !== cfg.password)) return [3 /*break*/, 1];
                                res.status(401).render('unauthorized');
                                return [3 /*break*/, 4];
                            case 1:
                                ip_1 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                if (!(ip_1 && typeof ip_1 === 'string')) return [3 /*break*/, 3];
                                geo_1 = geoip_lite_1["default"].lookup(ip_1);
                                if (!geo_1) return [3 /*break*/, 3];
                                return [4 /*yield*/, ds.transaction(function (manager) { return __awaiter(void 0, void 0, void 0, function () {
                                        var mbClient;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, manager.findOneBy(client_1.Client, { ip: ip_1 })];
                                                case 1:
                                                    mbClient = _a.sent();
                                                    if (!mbClient) return [3 /*break*/, 3];
                                                    client_2 = mbClient;
                                                    client_2.updatedAt = new Date();
                                                    return [4 /*yield*/, manager.save(client_2)];
                                                case 2:
                                                    _a.sent();
                                                    return [3 /*break*/, 5];
                                                case 3:
                                                    client_2 = new client_1.Client();
                                                    client_2.ip = ip_1;
                                                    client_2.country = geo_1.country;
                                                    client_2.city = geo_1.city;
                                                    return [4 /*yield*/, manager.save(client_2)];
                                                case 4:
                                                    _a.sent();
                                                    _a.label = 5;
                                                case 5: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 2:
                                _a.sent();
                                res.status(200).render('client', client_2);
                                return [2 /*return*/];
                            case 3:
                                res.status(400).render('client-no-geo');
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.post(v1_1.POSTClient, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var clientRepo, client;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!req.body.seed) return [3 /*break*/, 3];
                                clientRepo = ds.getRepository(client_1.Client);
                                return [4 /*yield*/, clientRepo.findOneBy({ id: req.body.client_id })];
                            case 1:
                                client = _a.sent();
                                if (!client) return [3 /*break*/, 3];
                                client.seed = req.body.seed;
                                return [4 /*yield*/, clientRepo.save(client)];
                            case 2:
                                _a.sent();
                                res.status(302).redirect(v1_1.GETClient);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.post(v1_1.POSTGetUrlToCrawl, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var ip, clientManager, client, u;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                log.debug('Getting video to crawl...');
                                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                req.setTimeout(1000 * 5);
                                if (typeof ip !== 'string') {
                                    res.status(401).render('unauthorized');
                                    return [2 /*return*/];
                                }
                                clientManager = ds.manager.getRepository(client_1.Client);
                                return [4 /*yield*/, clientManager.findOneBy({ ip: ip })];
                            case 1:
                                client = _a.sent();
                                if (!client) {
                                    res.status(504).json({ ok: false });
                                    return [2 /*return*/];
                                }
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
                app.post(v1_1.POSTClientCreate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var client, errors, clientManager, existing;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                client = new client_1.Client(req.body);
                                return [4 /*yield*/, (0, class_validator_1.validate)(client)];
                            case 1:
                                errors = _a.sent();
                                if (errors.length > 0) {
                                    log.error('Invalid client');
                                    log.error(errors.join('\n'));
                                    res.status(400).json({ OK: false, count: 0 });
                                    return [2 /*return*/];
                                }
                                clientManager = ds.manager.getRepository(client_1.Client);
                                return [4 /*yield*/, clientManager.findOneBy({ ip: client.ip })];
                            case 2:
                                existing = _a.sent();
                                if (existing) {
                                    Object.assign(client, existing);
                                }
                                return [4 /*yield*/, clientManager.save(client)];
                            case 3:
                                _a.sent();
                                res.json(client);
                                return [2 /*return*/];
                        }
                    });
                }); });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBd0M7QUFDeEMsMkRBQThDO0FBQzlDLG1DQUE4RDtBQUM5RCx1RUFBZ0U7QUFDaEUsbURBQTJDO0FBQzNDLG9EQUE4QjtBQUM5Qiw0REFBcUM7QUFDckMsZ0VBQXlDO0FBRXpDLDBEQUErQjtBQUUvQixrQ0FBbUQ7QUFDbkQsc0NBQXlEO0FBQ3pELG9DQUFtQztBQUNuQyxvREFBbUQ7QUFDbkQsc0NBQW1EO0FBRW5ELHNDQVl5QjtBQVF6QixJQUFNLE9BQU8sR0FBRyxVQUFDLENBQVU7SUFDekIsSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVGLElBQUksNEJBQTRCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzlDLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO0FBRXRCLElBQU0sV0FBVyxHQUFHLFVBQ3pCLEdBQWlCLEVBQUUsR0FBb0I7Ozs7O2dCQUVqQyxFQUFFLEdBQUcsSUFBSSxXQUFRLHVCQUNsQixHQUFHLENBQUMsRUFBRSxLQUNULElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsSUFDckIsQ0FBQzs7OztnQkFHRCxxQkFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUE7O2dCQUFsQixTQUFrQixDQUFDOzs7O2dCQUVuQixHQUFHLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sR0FBQyxDQUFDOzs7Z0JBSVIscUJBQU0s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
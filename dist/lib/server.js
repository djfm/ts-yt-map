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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBd0M7QUFDeEMsMkRBQThDO0FBQzlDLG1DQUE4RDtBQUM5RCx1RUFBZ0U7QUFDaEUsbURBQTJDO0FBQzNDLG9EQUE4QjtBQUM5Qiw0REFBcUM7QUFDckMsZ0VBQXlDO0FBRXpDLDBEQUErQjtBQUUvQixrQ0FBbUQ7QUFDbkQsc0NBQXlEO0FBQ3pELG9DQUFtQztBQUNuQyxvREFBbUQ7QUFDbkQsc0NBQW1EO0FBRW5ELHNDQVd5QjtBQVF6QixJQUFNLE9BQU8sR0FBRyxVQUFDLENBQVU7SUFDekIsSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVGLElBQUksNEJBQTRCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzlDLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO0FBRXRCLElBQU0sV0FBVyxHQUFHLFVBQ3pCLEdBQWlCLEVBQUUsR0FBb0I7Ozs7O2dCQUVqQyxFQUFFLEdBQUcsSUFBSSxXQUFRLHVCQUNsQixHQUFHLENBQUMsRUFBRSxLQUNULElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsSUFDckIsQ0FBQzs7OztnQkFHRCxxQkFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUE7O2dCQUFsQixTQUFrQixDQUFDOzs7O2dCQUVuQixHQUFHLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sR0FBQyxDQUFDOzs7Z0JBSVIscUJBQU0s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
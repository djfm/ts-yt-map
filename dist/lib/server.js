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
var project_1 = require("../models/project");
var url_1 = require("../models/url");
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
                ds = new typeorm_1.DataSource(__assign(__assign({ type: 'postgres' }, cfg.db), { synchronize: false, entities: [video_1.Video, channel_1.Channel, recommendation_1.Recommendation, client_1.Client, project_1.Project, url_1.URLModel], namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy() }));
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
                app.post(v1_1.POSTCreateProject, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var payload, errors, project, responseData, error_2, message;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                payload = new project_1.CreateProjectPayload();
                                Object.assign(payload, req.body);
                                return [4 /*yield*/, (0, class_validator_1.validate)(payload)];
                            case 1:
                                errors = _a.sent();
                                if (errors.length > 0) {
                                    log.error('Invalid project data', { errors: errors });
                                    res.status(400).json({ ok: false, errors: errors });
                                    return [2 /*return*/];
                                }
                                project = new project_1.Project();
                                project.name = payload.name;
                                project.description = payload.description;
                                project.createdAt = new Date();
                                project.updatedAt = new Date();
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, ds.manager.transaction(function (em) { return __awaiter(void 0, void 0, void 0, function () {
                                        var savedProject, _i, _a, url, m;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0: return [4 /*yield*/, em.save(project)];
                                                case 1:
                                                    savedProject = _b.sent();
                                                    _i = 0, _a = payload.urls;
                                                    _b.label = 2;
                                                case 2:
                                                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                                                    url = _a[_i];
                                                    m = new url_1.URLModel();
                                                    m.projectId = savedProject.id;
                                                    m.url = url;
                                                    m.createdAt = new Date();
                                                    m.updatedAt = new Date();
                                                    // eslint-disable-next-line no-await-in-loop
                                                    return [4 /*yield*/, em.save(m)];
                                                case 3:
                                                    // eslint-disable-next-line no-await-in-loop
                                                    _b.sent();
                                                    _b.label = 4;
                                                case 4:
                                                    _i++;
                                                    return [3 /*break*/, 2];
                                                case 5: return [2 /*return*/, savedProject];
                                            }
                                        });
                                    }); })];
                            case 3:
                                responseData = _a.sent();
                                res.json(responseData);
                                return [3 /*break*/, 5];
                            case 4:
                                error_2 = _a.sent();
                                message = asError(error_2).message;
                                log.error("Could not save project: ".concat(message), { error: error_2 });
                                res.status(500).send({ ok: false, message: message });
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBd0M7QUFDeEMsMkRBQThDO0FBQzlDLG1DQUE4RDtBQUM5RCx1RUFBZ0U7QUFDaEUsbURBQTJDO0FBQzNDLG9EQUE4QjtBQUM5Qiw0REFBcUM7QUFFckMsMERBQStCO0FBRS9CLHlDQUEwRDtBQUMxRCw2Q0FBZ0U7QUFDaEUsMkNBQTBDO0FBQzFDLDJEQUEwRDtBQUMxRCw2Q0FBa0U7QUFDbEUscUNBQXlDO0FBRXpDLHNDQUF1RDtBQUd2RCxzQ0FTeUI7QUFRekIsSUFBTSxPQUFPLEdBQUcsVUFBQyxDQUFVO0lBQ3pCLElBQUksQ0FBQyxZQUFZLEtBQUssRUFBRTtRQUN0QixPQUFPLENBQUMsQ0FBQztLQUNWO0lBQ0QsT0FBTyxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNwQyxDQUFDLENBQUM7QUFFRixJQUFJLDRCQUE0QixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM5QyxJQUFJLG9CQUFvQixHQUFHLENBQUMsQ0FBQztBQUU3QixJQUFNLGVBQWUsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0FBRW5DLElBQU0sV0FBVyxHQUFHLFVBQ3pCLEdBQWlCLEVBQUUsR0FBb0I7Ozs7O2dCQUVqQyxFQUFFLEdBQUcsSUFBSSxXQUFRLHVCQUNsQixHQUFHLENBQUMsRUFBRSxLQUNULElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsSUFDckIsQ0FBQzs7OztnQkFHRCxxQkFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUE7O2dCQUFsQixTQUFrQixDQUFDOzs7O2dCQUVuQixHQUFHLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEVBQUUsS0FBSyxFQUFFLEdB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
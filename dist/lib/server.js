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
var cors_1 = __importDefault(require("cors"));
var geoip_lite_1 = __importDefault(require("geoip-lite"));
var video_1 = require("../models/video");
var channel_1 = require("../models/channel");
var client_1 = require("../models/client");
var recommendation_1 = require("../models/recommendation");
var project_1 = require("../models/project");
var url_1 = require("../models/url");
var util_1 = require("../util");
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
    var pg, e_1, e_2, ds, getVideoToCrawl, getFirstLevelRecommendationsUrlToCrawl, getOrCreateClient, saveChannelAndGetId, saveVideo, app, server;
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
                    var repo, video;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                repo = ds.manager.getRepository(video_1.Video);
                                return [4 /*yield*/, repo.findOne({
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
                                video.updatedAt = new Date();
                                return [4 /*yield*/, repo.save(video)];
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
                }); };
                getFirstLevelRecommendationsUrlToCrawl = function (projectId) { return __awaiter(void 0, void 0, void 0, function () {
                    var repo, url;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                repo = ds.manager.getRepository(url_1.URLModel);
                                return [4 /*yield*/, repo.findOne({
                                        where: {
                                            crawled: false,
                                            crawlAttemptCount: (0, typeorm_1.LessThan)(4),
                                            latestCrawlAttemptedAt: (0, typeorm_1.LessThan)(new Date(Date.now() - 1000 * 60 * 10)),
                                            projectId: projectId
                                        },
                                        order: { id: 'ASC' }
                                    })];
                            case 1:
                                url = _a.sent();
                                if (!url) return [3 /*break*/, 3];
                                url.latestCrawlAttemptedAt = new Date();
                                url.updatedAt = new Date();
                                url.crawlAttemptCount += 1;
                                return [4 /*yield*/, repo.save(url)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, url];
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
                                return [4 /*yield*/, em.findOneBy(video_1.Video, { url: videoEntity.url, projectId: projectId })];
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
                app.use((0, cors_1["default"])());
                app.use(body_parser_1["default"].urlencoded({ extended: true }));
                app.get(v1_1.GETPing, function (req, res) {
                    res.json({ pong: true });
                });
                app.post(v1_1.POSTGetUrlToCrawl, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var ip, projectRepo, project, _a, seed_video_1, client_name_1, err_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                log.debug('Getting video to crawl...');
                                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                if (typeof ip !== 'string') {
                                    res.status(500).json({ message: 'Invalid IP address', ip: ip });
                                    return [2 /*return*/];
                                }
                                projectRepo = ds.getRepository(project_1.Project);
                                return [4 /*yield*/, projectRepo.findOneBy({ id: req.body.project_id })];
                            case 1:
                                project = _b.sent();
                                log.info({ ip: ip, project: project, reqBody: req.body });
                                if (!project) {
                                    res.status(500).json({ message: 'Invalid or missing project ID' });
                                    return [2 /*return*/];
                                }
                                if (!(project.type === 'exploration')) return [3 /*break*/, 3];
                                _a = req.body, seed_video_1 = _a.seed_video, client_name_1 = _a.client_name;
                                // eslint-disable-next-line camelcase
                                if (!seed_video_1 || !(typeof seed_video_1 === 'string')) {
                                    res.status(400).json({ ok: false, message: 'Missing seed video' });
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, (0, util_1.withLock)('exploration', function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var client, u;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, getOrCreateClient(client_name_1, ip, seed_video_1)];
                                                case 1:
                                                    client = _a.sent();
                                                    return [4 /*yield*/, getVideoToCrawl(client)];
                                                case 2:
                                                    u = _a.sent();
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
                                    }); })];
                            case 2:
                                _b.sent();
                                return [3 /*break*/, 9];
                            case 3:
                                if (!(project.type === 'first level recommendations')) return [3 /*break*/, 8];
                                _b.label = 4;
                            case 4:
                                _b.trys.push([4, 6, , 7]);
                                return [4 /*yield*/, (0, util_1.withLock)("first-level-recommendations-".concat(project.id), function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var url;
                                        var _a, _b;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0: return [4 /*yield*/, getFirstLevelRecommendationsUrlToCrawl(project.id)];
                                                case 1:
                                                    url = (_b = (_a = (_c.sent())) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '';
                                                    if (url) {
                                                        log.info("Sent first level recommendations url to crawl ".concat(url, " to ").concat(ip));
                                                    }
                                                    else {
                                                        log.info("No first level recommendations url to crawl for ".concat(ip));
                                                    }
                                                    res.status(200).json({ url: url });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 5:
                                _b.sent();
                                return [3 /*break*/, 7];
                            case 6:
                                err_1 = _b.sent();
                                log.error(err_1);
                                res.status(500).json({ message: asError(err_1).message });
                                return [3 /*break*/, 7];
                            case 7: return [3 /*break*/, 9];
                            case 8:
                                res.status(500).json({ message: 'Invalid project type' });
                                _b.label = 9;
                            case 9: return [2 /*return*/];
                        }
                    });
                }); });
                app.post(v1_1.POSTResetTimingForTesting, function (req, res) {
                    countingRecommendationsSince = Date.now();
                    recommendationsSaved = 0;
                    res.status(200).json({ ok: true });
                });
                app.post(v1_1.POSTRecommendation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var ip, project, data, errors, clientManager, client, videoRepo, from, recommendations, error_1, message;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                                if (typeof ip !== 'string') {
                                    res.status(500).json({ ok: false });
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, ds.getRepository(project_1.Project).findOneBy({ id: req.body.projectId })];
                            case 1:
                                project = _a.sent();
                                if (!project) {
                                    res.status(500).json({ ok: false, message: 'invalid project id' });
                                    return [2 /*return*/];
                                }
                                log.info("Received recommendations to save for project ".concat(project.id, " from ").concat(ip));
                                data = new scraper_1.ScrapedRecommendationData(req.body.client_name, req.body.projectId, req.body.from, req.body.to);
                                return [4 /*yield*/, (0, class_validator_1.validate)(data)];
                            case 2:
                                errors = _a.sent();
                                if (errors.length > 0) {
                                    log.error('Invalid recommendations', { errors: errors });
                                    res.status(400).json({ OK: false, count: 0 });
                                    throw new Error('Error in recommendations data.');
                                }
                                clientManager = ds.manager.getRepository(client_1.Client);
                                return [4 /*yield*/, clientManager.findOneBy({ ip: ip, name: data.client_name })];
                            case 3:
                                client = _a.sent();
                                if (!client) {
                                    res.status(500).json({ ok: false });
                                    return [2 /*return*/];
                                }
                                sentURLsToCrawl["delete"](data.from.url);
                                _a.label = 4;
                            case 4:
                                _a.trys.push([4, 9, , 10]);
                                videoRepo = ds.getRepository(video_1.Video);
                                return [4 /*yield*/, videoRepo.findOneBy({ url: data.from.url, projectId: data.projectId })];
                            case 5:
                                from = _a.sent();
                                if (!from) return [3 /*break*/, 7];
                                return [4 /*yield*/, ds.getRepository(recommendation_1.Recommendation).findBy({
                                        fromId: from.id
                                    })];
                            case 6:
                                recommendations = _a.sent();
                                if (recommendations.length >= 10) {
                                    log.info('Recommendations already exist.');
                                    res.status(201).json({ ok: true, count: 0 });
                                    return [2 /*return*/];
                                }
                                _a.label = 7;
                            case 7: return [4 /*yield*/, ds.manager.transaction(function (em) { return __awaiter(void 0, void 0, void 0, function () {
                                    var from, saves, elapsed, recommendationsPerMinute, urlsRepo, url;
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
                                                if (!(project.type === 'first level recommendations')) return [3 /*break*/, 6];
                                                urlsRepo = ds.getRepository(url_1.URLModel);
                                                return [4 /*yield*/, urlsRepo.findOneByOrFail({
                                                        url: data.from.url,
                                                        projectId: data.projectId
                                                    })];
                                            case 4:
                                                url = _a.sent();
                                                url.crawled = true;
                                                url.updatedAt = new Date();
                                                return [4 /*yield*/, urlsRepo.save(url)];
                                            case 5:
                                                _a.sent();
                                                _a.label = 6;
                                            case 6:
                                                res.json({ ok: true, count: data.to.length });
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                            case 8:
                                _a.sent();
                                return [3 /*break*/, 10];
                            case 9:
                                error_1 = _a.sent();
                                message = asError(error_1).message;
                                log.error("Could not save recommendations: ".concat(message), { error: error_1 });
                                log.error(error_1);
                                res.status(500).send({ ok: false, message: message });
                                return [3 /*break*/, 10];
                            case 10: return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx5QkFBd0M7QUFDeEMsMkRBQThDO0FBQzlDLG1DQUE4RDtBQUM5RCx1RUFBZ0U7QUFDaEUsbURBQTJDO0FBQzNDLG9EQUE4QjtBQUM5Qiw0REFBcUM7QUFDckMsOENBQXdCO0FBRXhCLDBEQUErQjtBQUUvQix5Q0FBMEQ7QUFDMUQsNkNBQWdFO0FBQ2hFLDJDQUEwQztBQUMxQywyREFBMEQ7QUFDMUQsNkNBQWtFO0FBQ2xFLHFDQUF5QztBQUN6QyxnQ0FBbUM7QUFFbkMsc0NBQXVEO0FBR3ZELHNDQVN5QjtBQVF6QixJQUFNLE9BQU8sR0FBRyxVQUFDLENBQVU7SUFDekIsSUFBSSxDQUFDLFlBQVksS0FBSyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDO0tBQ1Y7SUFDRCxPQUFPLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQztBQUVGLElBQUksNEJBQTRCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzlDLElBQUksb0JBQW9CLEdBQUcsQ0FBQyxDQUFDO0FBRTdCLElBQU0sZUFBZSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7QUFFbkMsSUFBTSxXQUFXLEdBQUcsVUFDekIsR0FBaUIsRUFBRSxHQUFvQjs7Ozs7Z0JBRWpDLEVBQUUsR0FBRyxJQUFJLFdBQVEsdUJBQ2xCLEdBQUcsQ0FBQyxFQUFFLEtBQ1QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxJQUNyQixDQUFDOzs7O2dCQUdELHFCQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBQTs7Z0JBQWxCLFNBQWtCLENBQUM7Ozs7Z0JBRW5CLEdBQUcsQ0FBQyxLQUFLLENBQUMsK0JB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
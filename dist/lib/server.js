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
    var pg, e_1, e_2, ds, updateCrawlingFlag, getVideoToCrawl, getFirstLevelRecommendationsUrlToCrawl, getOrCreateClient, saveChannelAndGetId, saveVideo, app, server;
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
                updateCrawlingFlag = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, ds.createQueryBuilder()
                                        .update(video_1.Video)
                                        .set({ crawling: false })
                                        .where({ crawling: true })
                                        .andWhere({ latestCrawlAttemptedAt: (0, typeorm_1.LessThan)(new Date(Date.now() - 15 * 60 * 1000)) })
                                        .execute()];
                            case 1:
                                _a.sent();
                                return [3 /*break*/, 3];
                            case 2:
                                e_3 = _a.sent();
                                log.error('Failed to update crawling flag', { error: e_3 });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); };
                setInterval(updateCrawlingFlag, 15 * 60 * 1000);
                getVideoToCrawl = function (client) { return __awaiter(void 0, void 0, void 0, function () {
                    var repo, video, now;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                repo = ds.manager.getRepository(video_1.Video);
                                return [4 /*yield*/, repo.findOne({
                                        where: {
                                            crawled: false,
                                            crawling: false,
                                            crawlAttemptCount: (0, typeorm_1.LessThan)(4),
                                            clientId: client.id
                                        },
                                        order: { url: 'ASC' }
                                    })];
                            case 1:
                                video = _a.sent();
                                if (!video) return [3 /*break*/, 3];
                                now = new Date();
                                video.latestCrawlAttemptedAt = now;
                                video.updatedAt = now;
                                video.latestCrawlAttemptedAt = now;
                                video.crawlAttemptCount += 1;
                                video.crawling = true;
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
                                                from.crawling = false;
                                                saves = Object.entries(data.to)
                                                    .map(function (_a) {
                                                    var rank = _a[0], video = _a[1];
                                                    return __awaiter(void 0, void 0, void 0, function () {
                                                        var to, recommendation, e_4;
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
                                                                    e_4 = _b.sent();
                                                                    log.error("Failed to save recommendation from ".concat(from.id, " to ").concat(to.id, ": ").concat(asError(e_4).message), { e: e_4 });
                                                                    throw e_4;
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
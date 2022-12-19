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
                // update the crawling flag every 15 minutes
                setInterval(updateCrawlingFlag, 15 * 60 * 1000);
                getVideoToCrawl = function (client) { return __awaiter(void 0, void 0, void 0, function () {
                    var repo, video, now;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                repo = ds.manager.getRepository(video_1.Video);
                                return [4 /*yield*/, repo.createQueryBuilder()
                                        .select()
                                        .where({
                                        crawled: false,
                                        crawling: false,
                                        crawlAttemptCount: (0, typeorm_1.LessThan)(4),
                                        clientId: client.id
                                    })
                                        .orderBy('RANDOM()')
                                        .take(1)
                                        .getOne()];
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
                    var currentChannel, newChannel, newChannelErrors, savedChannel, e_4, channel_2;
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
                                _a.label = 3;
                            case 3:
                                _a.trys.push([3, 5, , 7]);
                                return [4 /*yield*/, repo.save(newChannel)];
                            case 4:
                                savedChannel = _a.sent();
                                return [2 /*return*/, savedChannel.id];
                            case 5:
                                e_4 = _a.sent();
                                return [4 /*yield*/, repo.findOneBy(channel_1.Channel, {
                                        youtubeId: newChannel.youtubeId
                                    })];
                            case 6:
                                channel_2 = _a.sent();
                                if (channel_2) {
                                    return [2 /*return*/, channel_2.id];
                                }
                                log.error('Failed to find channel after save failed', { error: e_4 });
                                throw e_4;
                            case 7: return [2 /*return*/];
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
                                                        var to, recommendation, e_5;
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
                                                                    e_5 = _b.sent();
                                                                    log.error("Failed to save recommendation from ".concat(from.id, " to ").concat(to.id, ": ").concat(asError(e_5).message), { e: e_5 });
                                                                    throw e_5;
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
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
exports.__esModule = true;
exports.Video = exports.ScrapedVideoData = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var util_1 = require("../util");
var ScrapedVideoData = /** @class */ (function () {
    function ScrapedVideoData() {
        this.url = '';
        this.rawLikeCount = '';
        this.title = '';
        this.description = '';
        this.rawPublishedOn = '';
        this.rawViewCount = '';
        this.clientId = 0;
        this.channelURL = '';
        this.recommendationURLs = [];
    }
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedVideoData.prototype, "url");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedVideoData.prototype, "rawLikeCount");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedVideoData.prototype, "title");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedVideoData.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedVideoData.prototype, "rawPublishedOn");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedVideoData.prototype, "rawViewCount");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ScrapedVideoData.prototype, "clientId");
    return ScrapedVideoData;
}());
exports.ScrapedVideoData = ScrapedVideoData;
var Video = /** @class */ (function (_super) {
    __extends(Video, _super);
    function Video(video) {
        var _this = _super.call(this) || this;
        _this.id = -1;
        _this.projectId = -1;
        _this.crawled = false;
        _this.crawling = false;
        _this.latestCrawlAttemptedAt = new Date(0);
        _this.crawlAttemptCount = 0;
        _this.likeCount = -1;
        _this.publishedOn = new Date(0);
        _this.channelId = -1;
        _this.viewCount = -1;
        _this.createdAt = new Date();
        _this.updatedAt = new Date();
        if (video) {
            for (var _i = 0, _a = Object.entries(video); _i < _a.length; _i++) {
                var _b = _a[_i], k = _b[0], v = _b[1];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _this[k] = v;
            }
            _this.likeCount = (0, util_1.convertNumber)(_this.rawLikeCount);
            _this.viewCount = (0, util_1.convertNumber)(_this.rawViewCount.split(' ')[0]);
            _this.publishedOn = new Date(_this.rawPublishedOn);
        }
        return _this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Video.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Video.prototype, "projectId");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Boolean)
    ], Video.prototype, "crawled");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Boolean)
    ], Video.prototype, "crawling");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Video.prototype, "latestCrawlAttemptedAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Video.prototype, "crawlAttemptCount");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Video.prototype, "likeCount");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Video.prototype, "publishedOn");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Video.prototype, "channelId");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Video.prototype, "viewCount");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Video.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Video.prototype, "updatedAt");
    Video = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [ScrapedVideoData])
    ], Video);
    return Video;
}(ScrapedVideoData));
exports.Video = Video;
exports["default"] = ScrapedVideoData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL3ZpZGVvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFpRTtBQUNqRSxtREFBeUM7QUFHekMsZ0NBQXdDO0FBRXhDO0lBQUE7UUFHUyxRQUFHLEdBQVcsRUFBRSxDQUFDO1FBSWpCLGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBSTFCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFJbkIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFJekIsbUJBQWMsR0FBVyxFQUFFLENBQUM7UUFJNUIsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFHMUIsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUVyQixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBSXhCLHVCQUFrQixHQUFhLEVBQUUsQ0FBQztJQUMzQyxDQUFDO0lBaENDO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7eUNBQ2M7SUFFeEI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOztrREFDdUI7SUFFakM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOzsyQ0FDZ0I7SUFFMUI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOztpREFDc0I7SUFFaEM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOztvREFDeUI7SUFFbkM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOztrREFDdUI7SUFFakM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7OzhDQUNtQjtJQU85Qix1QkFBQztDQUFBLEFBakNELElBaUNDO0FBakNZ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
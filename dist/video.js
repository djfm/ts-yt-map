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
var util_1 = require("./util");
var ScrapedVideoData = /** @class */ (function () {
    function ScrapedVideoData() {
        this.url = '';
        this.rawLikeCount = '';
        this.category = undefined;
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
        __metadata("design:type", Object)
    ], ScrapedVideoData.prototype, "category");
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
        _this.crawled = false;
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
        __metadata("design:type", Boolean)
    ], Video.prototype, "crawled");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdmlkZW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlFO0FBQ2pFLG1EQUF5QztBQUd6QywrQkFBdUM7QUFFdkM7SUFBQTtRQUdTLFFBQUcsR0FBVyxFQUFFLENBQUM7UUFJakIsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFHMUIsYUFBUSxHQUF1QixTQUFTLENBQUM7UUFJekMsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUluQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUl6QixtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUk1QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUcxQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBRXJCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFJeEIsdUJBQWtCLEdBQWEsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFuQ0M7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOzt5Q0FDYztJQUV4QjtRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7O2tEQUN1QjtJQUVqQztRQUFDLElBQUEsZ0JBQU0sR0FBRTs7OENBQ3VDO0lBRWhEO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7MkNBQ2dCO0lBRTFCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7aURBQ3NCO0lBRWhDO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7b0RBQ3lCO0lBRW5DO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7a0RBQ3VCO0lBRWpDO1FBQUMsSUFBQSxnQkFBTSxHQUFFOzs4Q0FDbUI7SUFPOUIsdUJBQUM7Q0FBQSxBQXBDRCxJQW9DQztBQXBDWSw0Q0FBZ0I7QUF1QzdCO0lBQTJCLHlCQUFnQjtJQStCekMsZUFBWSxLQUF3QjtRQUFwQyxZQUNFLGlCQUFPLFNBV1I7UUF6Q00sUUFBRSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR2hCLGFBQU8sR0FBWSxLQUFLLENBQUM7UUFHekIsNEJBQXNCLEdBQVMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHM0MsdUJBQWlCLEdBQVcsQ0FBQyxDQUFDO1FBRzlCLGVBQVMsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUd2QixpQkFBVyxHQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR2hDLGVBQVMsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUd2QixlQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHdkIsZUFBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFHN0IsZUFBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFJbEMsSUFBSSxLQUFLLEVBQUU7WUFDVCxLQUFxQixVQUFxQixFQUFyQixLQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQXJCLGNBQXFCLEVBQXJCLElBQXFCLEVBQUU7Z0JBQWpDLElBQUEsV0FBTSxFQUFMLENBQUMsUUFBQSxFQUFFLENBQUMsUUFBQTtnQkFDZCw4REFBOEQ7Z0JBQzdELEtBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEI7WUFFRCxLQUFJLENBQUMsU0FBUyxHQUFHLElBQUEsb0JBQWEsRUFBQyxLQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDbEQsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFBLG9CQUFhLEVBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNsRDs7SUFDSCxDQUFDO0lBMUNEO1FBQUMsSUFBQSxnQ0FBc0IsR0FBRTs7NkJBQ0Y7SUFFdkI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7O2tDQUN1QjtJQUVoQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDc0IsSUFBSTtpREFBZTtJQUVsRDtRQUFDLElBQUEsZ0JBQU0sR0FBRTs7NENBQzRCO0lBRXJDO1FBQUMsSUFBQSxnQkFBTSxHQUFFOztvQ0FDcUI7SUFFOUI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ1csSUFBSTtzQ0FBZTtJQUV2QztRQUFDLElBQUEsZ0JBQU0sR0FBRTs7b0NBQ3FCO0lBRTlCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOztvQ0FDcUI7SUFFOUI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ1MsSUFBSTtvQ0FBYztJQUVwQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDUyxJQUFJO29DQUFjO0lBN0J6QixLQUFLO1FBRGpCLElBQUEsZ0JBQU0sR0FBRTt5Q0FnQ2EsZ0JBQWdCO09BL0J6QixLQUFLLENBNENqQjtJQUFELFlBQUM7Q0FBQSxBQTdDRCxDQUMyQixnQkFBZ0IsR0E0QzFDO0FBNUNZLHNCQUFLO0FBOENsQixxQkFBZSxnQkFBZ0IsQ0FBQyJ9
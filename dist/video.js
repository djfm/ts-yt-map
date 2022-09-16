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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlkZW8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdmlkZW8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlFO0FBQ2pFLG1EQUF5QztBQUd6QywrQkFBdUM7QUFFdkM7SUFBQTtRQUdTLFFBQUcsR0FBVyxFQUFFLENBQUM7UUFJakIsaUJBQVksR0FBVyxFQUFFLENBQUM7UUFJMUIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUluQixnQkFBVyxHQUFXLEVBQUUsQ0FBQztRQUl6QixtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUk1QixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUcxQixhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBRXJCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFJeEIsdUJBQWtCLEdBQWEsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFoQ0M7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOzt5Q0FDYztJQUV4QjtRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7O2tEQUN1QjtJQUVqQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7OzJDQUNnQjtJQUUxQjtRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7O2lEQUNzQjtJQUVoQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7O29EQUN5QjtJQUVuQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7O2tEQUN1QjtJQUVqQztRQUFDLElBQUEsZ0JBQU0sR0FBRTs7OENBQ21CO0lBTzlCLHVCQUFDO0NBQUEsQUFqQ0QsSUFpQ0M7QUFqQ1ksNENBQWdCO0FBb0M3QjtJQUEyQix5QkFBZ0I7SUErQnpDLGVBQVksS0FBd0I7UUFBcEMsWUFDRSxpQkFBTyxTQVdSO1FBekNNLFFBQUUsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUdoQixhQUFPLEdBQVksS0FBSyxDQUFDO1FBR3pCLDRCQUFzQixHQUFTLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRzNDLHVCQUFpQixHQUFXLENBQUMsQ0FBQztRQUc5QixlQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHdkIsaUJBQVcsR0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUdoQyxlQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHdkIsZUFBUyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR3ZCLGVBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRzdCLGVBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBSWxDLElBQUksS0FBSyxFQUFFO1lBQ1QsS0FBcUIsVUFBcUIsRUFBckIsS0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFyQixjQUFxQixFQUFyQixJQUFxQixFQUFFO2dCQUFqQyxJQUFBLFdBQU0sRUFBTCxDQUFDLFFBQUEsRUFBRSxDQUFDLFFBQUE7Z0JBQ2QsOERBQThEO2dCQUM3RCxLQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RCO1lBRUQsS0FBSSxDQUFDLFNBQVMsR0FBRyxJQUFBLG9CQUFhLEVBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ2xELEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBQSxvQkFBYSxFQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEUsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDbEQ7O0lBQ0gsQ0FBQztJQTFDRDtRQUFDLElBQUEsZ0NBQXNCLEdBQUU7OzZCQUNGO0lBRXZCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOztrQ0FDdUI7SUFFaEM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ3NCLElBQUk7aURBQWU7SUFFbEQ7UUFBQyxJQUFBLGdCQUFNLEdBQUU7OzRDQUM0QjtJQUVyQztRQUFDLElBQUEsZ0JBQU0sR0FBRTs7b0NBQ3FCO0lBRTlCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNXLElBQUk7c0NBQWU7SUFFdkM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7O29DQUNxQjtJQUU5QjtRQUFDLElBQUEsZ0JBQU0sR0FBRTs7b0NBQ3FCO0lBRTlCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNTLElBQUk7b0NBQWM7SUFFcEM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ1MsSUFBSTtvQ0FBYztJQTdCekIsS0FBSztRQURqQixJQUFBLGdCQUFNLEdBQUU7eUNBZ0NhLGdCQUFnQjtPQS9CekIsS0FBSyxDQTRDakI7SUFBRCxZQUFDO0NBQUEsQUE3Q0QsQ0FDMkIsZ0JBQWdCLEdBNEMxQztBQTVDWSxzQkFBSztBQThDbEIscUJBQWUsZ0JBQWdCLENBQUMifQ==
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
exports.Channel = exports.ScrapedChannelData = exports.asChannelType = exports.ChannelType = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var util_1 = require("../util");
var ChannelType;
(function (ChannelType) {
    ChannelType["C"] = "/c/";
    ChannelType["Channel"] = "/channel/";
    ChannelType["User"] = "/user/";
    ChannelType["Raw"] = "/";
})(ChannelType = exports.ChannelType || (exports.ChannelType = {}));
var asChannelType = function (s) {
    if (s === 'c') {
        return ChannelType.C;
    }
    if (s === 'channel') {
        return ChannelType.Channel;
    }
    if (s === 'user') {
        return ChannelType.User;
    }
    return ChannelType.Raw;
};
exports.asChannelType = asChannelType;
var ScrapedChannelData = /** @class */ (function () {
    function ScrapedChannelData() {
        this.url = '';
        this.htmlLang = 'en';
        this.channelType = ChannelType.C;
        this.shortName = '';
        this.humanName = '';
        this.youtubeId = '';
        this.rawSubscriberCount = '';
        this.description = '';
    }
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "url");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "htmlLang");
    __decorate([
        (0, typeorm_1.Column)({ name: 'type' }),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "channelType");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "shortName");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "humanName");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "youtubeId");
    __decorate([
        (0, typeorm_1.Column)(),
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "rawSubscriberCount");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], ScrapedChannelData.prototype, "description");
    ScrapedChannelData = __decorate([
        (0, typeorm_1.Entity)()
    ], ScrapedChannelData);
    return ScrapedChannelData;
}());
exports.ScrapedChannelData = ScrapedChannelData;
exports["default"] = ScrapedChannelData;
var Channel = /** @class */ (function (_super) {
    __extends(Channel, _super);
    function Channel(channel) {
        var _this = _super.call(this) || this;
        _this.id = -1;
        _this.subscriberCount = -1;
        _this.createdAt = new Date();
        _this.updatedAt = new Date();
        if (channel) {
            for (var _i = 0, _a = Object.entries(channel); _i < _a.length; _i++) {
                var _b = _a[_i], k = _b[0], v = _b[1];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                _this[k] = v;
            }
            _this.subscriberCount = (0, util_1.convertNumber)(_this.rawSubscriberCount.split(' ')[0]);
        }
        return _this;
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Channel.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Channel.prototype, "subscriberCount");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Channel.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Channel.prototype, "updatedAt");
    Channel = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [ScrapedChannelData])
    ], Channel);
    return Channel;
}(ScrapedChannelData));
exports.Channel = Channel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvY2hhbm5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBaUU7QUFDakUsbURBQXlDO0FBRXpDLGdDQUF3QztBQUV4QyxJQUFZLFdBS1g7QUFMRCxXQUFZLFdBQVc7SUFDckIsd0JBQVMsQ0FBQTtJQUNULG9DQUFxQixDQUFBO0lBQ3JCLDhCQUFlLENBQUE7SUFDZix3QkFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUxXLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBS3RCO0FBRU0sSUFBTSxhQUFhLEdBQUcsVUFBQyxDQUFTO0lBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRTtRQUNiLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQztLQUN0QjtJQUVELElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtRQUNuQixPQUFPLFdBQVcsQ0FBQyxPQUFPLENBQUM7S0FDNUI7SUFFRCxJQUFJLENBQUMsS0FBSyxNQUFNLEVBQUU7UUFDaEIsT0FBTyxXQUFXLENBQUMsSUFBSSxDQUFDO0tBQ3pCO0lBRUQsT0FBTyxXQUFXLENBQUMsR0FBRyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQWRXLFFBQUEsYUFBYSxpQkFjeEI7QUFHRjtJQUFBO1FBR1MsUUFBRyxHQUFXLEVBQUUsQ0FBQztRQUlqQixhQUFRLEdBQVcsSUFBSSxDQUFDO1FBR3hCLGdCQUFXLEdBQWdCLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFJekMsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUl2QixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBSXZCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFJdkIsdUJBQWtCLEdBQVcsRUFBRSxDQUFDO1FBR2hDLGdCQUFXLEdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUM7SUE3QkM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOzsyQ0FDYztJQUV4QjtRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7O2dEQUNxQjtJQUUvQjtRQUFDLElBQUEsZ0JBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs7bURBQ3VCO0lBRWhEO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7aURBQ29CO0lBRTlCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7aURBQ29CO0lBRTlCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7aURBQ29CO0lBRTlCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7MERBQzZCO0lBRXZDO1FBQUMsSUFBQSxnQkFBTSxHQUFFOzttREFDdUI7SUE3QnJCLGtCQUFrQjtRQUQ5QixJQUFBLGdCQUFNLEdBQUU7T0FDSSxrQkFBa0IsQ0E4QjlCO0lBQUQseUJBQUM7Q0FBQSxBQTlCRCxJQThCQztBQTlCWSxnREFBa0I7QUFnQy9CLHFCQUFlLGtCQUFrQixDQUFDO0FBR2xDO0lBQTZCLDJCQUFrQjtJQWE3QyxpQkFBWSxPQUE0QjtRQUF4QyxZQUNFLGlCQUFPLFNBU1I7UUFyQk0sUUFBRSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR2hCLHFCQUFlLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHN0IsZUFBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFHN0IsZUFBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFJbEMsSUFBSSxPQUFPLEVBQUU7WUFDWCxLQUFxQixVQUF1QixFQUF2QixLQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQXZCLGNBQXVCLEVBQXZCLElBQXVCLEVBQUU7Z0JBQW5DLElBQUEsV0FBTSxFQUFMLENBQUMsUUFBQSxFQUFFLENBQUMsUUFBQTtnQkFDZCw4REFBOEQ7Z0JBQzdELEtBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEI7WUFFRCxLQUFJLENBQUMsZUFBZSxHQUFHLElBQUEsb0JBQWEsRUFBQyxLQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0U7O0lBQ0gsQ0FBQztJQXRCRDtRQUFDLElBQUEsZ0NBQXNCLEdBQUU7OytCQUNGO0lBRXZCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOzs0Q0FDMkI7SUFFcEM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ1MsSUFBSTtzQ0FBYztJQUVwQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDUyxJQUFJO3NDQUFjO0lBWHpCLE9BQU87UUFEbkIsSUFBQSxnQkFBTSxHQUFFO3lDQWNlLGtCQUFrQjtPQWI3QixPQUFPLENBd0JuQjtJQUFELGNBQUM7Q0FBQSxBQXpCRCxDQUM2QixrQkFBa0IsR0F3QjlDO0FBeEJZLDBCQUFPIn0=
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
var util_1 = require("./util");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFpRTtBQUNqRSxtREFBeUM7QUFFekMsK0JBQXVDO0FBRXZDLElBQVksV0FLWDtBQUxELFdBQVksV0FBVztJQUNyQix3QkFBUyxDQUFBO0lBQ1Qsb0NBQXFCLENBQUE7SUFDckIsOEJBQWUsQ0FBQTtJQUNmLHdCQUFTLENBQUE7QUFDWCxDQUFDLEVBTFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFLdEI7QUFFTSxJQUFNLGFBQWEsR0FBRyxVQUFDLENBQVM7SUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFO1FBQ2IsT0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDO0tBQ3RCO0lBRUQsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO1FBQ25CLE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQztLQUM1QjtJQUVELElBQUksQ0FBQyxLQUFLLE1BQU0sRUFBRTtRQUNoQixPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUM7S0FDekI7SUFFRCxPQUFPLFdBQVcsQ0FBQyxHQUFHLENBQUM7QUFDekIsQ0FBQyxDQUFDO0FBZFcsUUFBQSxhQUFhLGlCQWN4QjtBQUdGO0lBQUE7UUFHUyxRQUFHLEdBQVcsRUFBRSxDQUFDO1FBSWpCLGFBQVEsR0FBVyxJQUFJLENBQUM7UUFHeEIsZ0JBQVcsR0FBZ0IsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUl6QyxjQUFTLEdBQVcsRUFBRSxDQUFDO1FBSXZCLGNBQVMsR0FBVyxFQUFFLENBQUM7UUFJdkIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQUl2Qix1QkFBa0IsR0FBVyxFQUFFLENBQUM7UUFHaEMsZ0JBQVcsR0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQTdCQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtRQUNSLElBQUEsd0JBQU0sRUFBQyxDQUFDLENBQUM7OzJDQUNjO0lBRXhCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO1FBQ1IsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7Z0RBQ3FCO0lBRS9CO1FBQUMsSUFBQSxnQkFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDOzttREFDdUI7SUFFaEQ7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOztpREFDb0I7SUFFOUI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOztpREFDb0I7SUFFOUI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOztpREFDb0I7SUFFOUI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7UUFDUixJQUFBLHdCQUFNLEVBQUMsQ0FBQyxDQUFDOzswREFDNkI7SUFFdkM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7O21EQUN1QjtJQTdCckIsa0JBQWtCO1FBRDlCLElBQUEsZ0JBQU0sR0FBRTtPQUNJLGtCQUFrQixDQThCOUI7SUFBRCx5QkFBQztDQUFBLEFBOUJELElBOEJDO0FBOUJZLGdEQUFrQjtBQWdDL0IscUJBQWUsa0JBQWtCLENBQUM7QUFHbEM7SUFBNkIsMkJBQWtCO0lBYTdDLGlCQUFZLE9BQTRCO1FBQXhDLFlBQ0UsaUJBQU8sU0FTUjtRQXJCTSxRQUFFLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHaEIscUJBQWUsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUc3QixlQUFTLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUc3QixlQUFTLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUlsQyxJQUFJLE9BQU8sRUFBRTtZQUNYLEtBQXFCLFVBQXVCLEVBQXZCLEtBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUIsRUFBRTtnQkFBbkMsSUFBQSxXQUFNLEVBQUwsQ0FBQyxRQUFBLEVBQUUsQ0FBQyxRQUFBO2dCQUNkLDhEQUE4RDtnQkFDN0QsS0FBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0QjtZQUVELEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBQSxvQkFBYSxFQUFDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RTs7SUFDSCxDQUFDO0lBdEJEO1FBQUMsSUFBQSxnQ0FBc0IsR0FBRTs7K0JBQ0Y7SUFFdkI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7OzRDQUMyQjtJQUVwQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDUyxJQUFJO3NDQUFjO0lBRXBDO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNTLElBQUk7c0NBQWM7SUFYekIsT0FBTztRQURuQixJQUFBLGdCQUFNLEdBQUU7eUNBY2Usa0JBQWtCO09BYjdCLE9BQU8sQ0F3Qm5CO0lBQUQsY0FBQztDQUFBLEFBekJELENBQzZCLGtCQUFrQixHQXdCOUM7QUF4QlksMEJBQU8ifQ==
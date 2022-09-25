"use strict";
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
exports.Client = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var Client = /** @class */ (function () {
    function Client(data) {
        if (data === void 0) { data = {}; }
        this.id = 0;
        this.ip = '';
        this.name = '';
        this.country = '';
        this.city = '';
        this.seed = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
        Object.assign(this, data);
    }
    __decorate([
        (0, class_validator_1.Min)(0),
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Client.prototype, "id");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Client.prototype, "ip");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Client.prototype, "name");
    __decorate([
        (0, class_validator_1.Length)(1, 16),
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Client.prototype, "country");
    __decorate([
        (0, class_validator_1.Length)(1, 255),
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Client.prototype, "city");
    __decorate([
        (0, class_validator_1.Length)(0, 255),
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Client.prototype, "seed");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Client.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Client.prototype, "updatedAt");
    Client = __decorate([
        (0, typeorm_1.Entity)(),
        __metadata("design:paramtypes", [Object])
    ], Client);
    return Client;
}());
exports.Client = Client;
exports["default"] = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBaUU7QUFFakUsbURBRXlCO0FBR3pCO0lBK0JFLGdCQUFZLElBQTBCO1FBQTFCLHFCQUFBLEVBQUEsU0FBMEI7UUE1Qi9CLE9BQUUsR0FBVyxDQUFDLENBQUM7UUFJZixPQUFFLEdBQVcsRUFBRSxDQUFDO1FBSWhCLFNBQUksR0FBVyxFQUFFLENBQUM7UUFJbEIsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUlyQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBSWxCLFNBQUksR0FBVyxFQUFFLENBQUM7UUFHbEIsY0FBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFHN0IsY0FBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFHbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQWhDRDtRQUFDLElBQUEscUJBQUcsRUFBQyxDQUFDLENBQUM7UUFDTixJQUFBLGdDQUFzQixHQUFFOzs4QkFDSDtJQUV0QjtRQUFDLElBQUEsd0JBQU0sRUFBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ2QsSUFBQSxnQkFBTSxHQUFFOzs4QkFDYztJQUV2QjtRQUFDLElBQUEsd0JBQU0sRUFBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ2QsSUFBQSxnQkFBTSxHQUFFOztnQ0FDZ0I7SUFFekI7UUFBQyxJQUFBLHdCQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNiLElBQUEsZ0JBQU0sR0FBRTs7bUNBQ21CO0lBRTVCO1FBQUMsSUFBQSx3QkFBTSxFQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7UUFDZCxJQUFBLGdCQUFNLEdBQUU7O2dDQUNnQjtJQUV6QjtRQUFDLElBQUEsd0JBQU0sRUFBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ2QsSUFBQSxnQkFBTSxHQUFFOztnQ0FDZ0I7SUFFekI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ1MsSUFBSTtxQ0FBYztJQUVwQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDUyxJQUFJO3FDQUFjO0lBN0J6QixNQUFNO1FBRGxCLElBQUEsZ0JBQU0sR0FBRTs7T0FDSSxNQUFNLENBa0NsQjtJQUFELGFBQUM7Q0FBQSxBQW5DRCxJQW1DQztBQWxDWSx3QkFBTTtBQW9DbkIscUJBQWUsTUFBTSxDQUFDIn0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlFO0FBRWpFLG1EQUV5QjtBQUd6QjtJQStCRSxnQkFBWSxJQUEwQjtRQUExQixxQkFBQSxFQUFBLFNBQTBCO1FBNUIvQixPQUFFLEdBQVcsQ0FBQyxDQUFDO1FBSWYsT0FBRSxHQUFXLEVBQUUsQ0FBQztRQUloQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBSWxCLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFJckIsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQUlsQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBR2xCLGNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRzdCLGNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBR2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFoQ0Q7UUFBQyxJQUFBLHFCQUFHLEVBQUMsQ0FBQyxDQUFDO1FBQ04sSUFBQSxnQ0FBc0IsR0FBRTs7OEJBQ0g7SUFFdEI7UUFBQyxJQUFBLHdCQUFNLEVBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNkLElBQUEsZ0JBQU0sR0FBRTs7OEJBQ2M7SUFFdkI7UUFBQyxJQUFBLHdCQUFNLEVBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNkLElBQUEsZ0JBQU0sR0FBRTs7Z0NBQ2dCO0lBRXpCO1FBQUMsSUFBQSx3QkFBTSxFQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDYixJQUFBLGdCQUFNLEdBQUU7O21DQUNtQjtJQUU1QjtRQUFDLElBQUEsd0JBQU0sRUFBQyxDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ2QsSUFBQSxnQkFBTSxHQUFFOztnQ0FDZ0I7SUFFekI7UUFBQyxJQUFBLHdCQUFNLEVBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztRQUNkLElBQUEsZ0JBQU0sR0FBRTs7Z0NBQ2dCO0lBRXpCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNTLElBQUk7cUNBQWM7SUFFcEM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ1MsSUFBSTtxQ0FBYztJQTdCekIsTUFBTTtRQURsQixJQUFBLGdCQUFNLEdBQUU7O09BQ0ksTUFBTSxDQWtDbEI7SUFBRCxhQUFDO0NBQUEsQUFuQ0QsSUFtQ0M7QUFsQ1ksd0JBQU07QUFvQ25CLHFCQUFlLE1BQU0sQ0FBQyJ9
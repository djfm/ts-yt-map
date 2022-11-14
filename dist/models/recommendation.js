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
exports.Recommendation = void 0;
var typeorm_1 = require("typeorm");
var Recommendation = /** @class */ (function () {
    function Recommendation() {
        this.id = -1;
        this.fromId = -1;
        this.toId = -1;
        this.rank = -1;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Recommendation.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Recommendation.prototype, "fromId");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Recommendation.prototype, "toId");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Recommendation.prototype, "rank");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Recommendation.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Recommendation.prototype, "updatedAt");
    Recommendation = __decorate([
        (0, typeorm_1.Entity)()
    ], Recommendation);
    return Recommendation;
}());
exports.Recommendation = Recommendation;
exports["default"] = Recommendation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb21tZW5kYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL3JlY29tbWVuZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFpRTtBQUdqRTtJQUFBO1FBRVMsT0FBRSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR2hCLFdBQU0sR0FBVyxDQUFDLENBQUMsQ0FBQztRQUdwQixTQUFJLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHbEIsU0FBSSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR2xCLGNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRzdCLGNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFqQkM7UUFBQyxJQUFBLGdDQUFzQixHQUFFOztzQ0FDRjtJQUV2QjtRQUFDLElBQUEsZ0JBQU0sR0FBRTs7MENBQ2tCO0lBRTNCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOzt3Q0FDZ0I7SUFFekI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7O3dDQUNnQjtJQUV6QjtRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDUyxJQUFJOzZDQUFjO0lBRXBDO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNTLElBQUk7NkNBQWM7SUFqQnpCLGNBQWM7UUFEMUIsSUFBQSxnQkFBTSxHQUFFO09BQ0ksY0FBYyxDQWtCMUI7SUFBRCxxQkFBQztDQUFBLEFBbEJELElBa0JDO0FBbEJZLHdDQUFjO0FBb0IzQixxQkFBZSxjQUFjLENBQUMifQ==
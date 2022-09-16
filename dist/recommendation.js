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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVjb21tZW5kYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmVjb21tZW5kYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlFO0FBR2pFO0lBQUE7UUFFUyxPQUFFLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHaEIsV0FBTSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR3BCLFNBQUksR0FBVyxDQUFDLENBQUMsQ0FBQztRQUdsQixTQUFJLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHbEIsY0FBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFHN0IsY0FBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQWpCQztRQUFDLElBQUEsZ0NBQXNCLEdBQUU7O3NDQUNGO0lBRXZCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOzswQ0FDa0I7SUFFM0I7UUFBQyxJQUFBLGdCQUFNLEdBQUU7O3dDQUNnQjtJQUV6QjtRQUFDLElBQUEsZ0JBQU0sR0FBRTs7d0NBQ2dCO0lBRXpCO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNTLElBQUk7NkNBQWM7SUFFcEM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ1MsSUFBSTs2Q0FBYztJQWpCekIsY0FBYztRQUQxQixJQUFBLGdCQUFNLEdBQUU7T0FDSSxjQUFjLENBa0IxQjtJQUFELHFCQUFDO0NBQUEsQUFsQkQsSUFrQkM7QUFsQlksd0NBQWM7QUFvQjNCLHFCQUFlLGNBQWMsQ0FBQyJ9
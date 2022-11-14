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
exports.URLModel = void 0;
var typeorm_1 = require("typeorm");
var URLModel = /** @class */ (function () {
    function URLModel() {
        this.id = -1;
        this.projectId = -1;
        this.url = '';
        this.crawled = false;
        this.latestCrawlAttemptedAt = new Date(0);
        this.crawlAttemptCount = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], URLModel.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], URLModel.prototype, "projectId");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], URLModel.prototype, "url");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Boolean)
    ], URLModel.prototype, "crawled");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], URLModel.prototype, "latestCrawlAttemptedAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], URLModel.prototype, "crawlAttemptCount");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], URLModel.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], URLModel.prototype, "updatedAt");
    URLModel = __decorate([
        (0, typeorm_1.Entity)('url')
    ], URLModel);
    return URLModel;
}());
exports.URLModel = URLModel;
exports["default"] = URLModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy91cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlFO0FBR2pFO0lBQUE7UUFFUyxPQUFFLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFHaEIsY0FBUyxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR3ZCLFFBQUcsR0FBVyxFQUFFLENBQUM7UUFHakIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUd6QiwyQkFBc0IsR0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUczQyxzQkFBaUIsR0FBVyxDQUFDLENBQUM7UUFHOUIsY0FBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFHN0IsY0FBUyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7SUFDdEMsQ0FBQztJQXZCQztRQUFDLElBQUEsZ0NBQXNCLEdBQUU7O2dDQUNGO0lBRXZCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOzt1Q0FDcUI7SUFFOUI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7O2lDQUNlO0lBRXhCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOztxQ0FDdUI7SUFFaEM7UUFBQyxJQUFBLGdCQUFNLEdBQUU7a0NBQ3NCLElBQUk7b0RBQWU7SUFFbEQ7UUFBQyxJQUFBLGdCQUFNLEdBQUU7OytDQUM0QjtJQUVyQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDUyxJQUFJO3VDQUFjO0lBRXBDO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNTLElBQUk7dUNBQWM7SUF2QnpCLFFBQVE7UUFEcEIsSUFBQSxnQkFBTSxFQUFDLEtBQUssQ0FBQztPQUNELFFBQVEsQ0F3QnBCO0lBQUQsZUFBQztDQUFBLEFBeEJELElBd0JDO0FBeEJZLDRCQUFRO0FBMEJyQixxQkFBZSxRQUFRLENBQUMifQ==
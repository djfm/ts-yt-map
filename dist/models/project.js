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
exports.Project = exports.CreateProjectPayload = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var CreateProjectPayload = /** @class */ (function () {
    function CreateProjectPayload() {
        this.name = '';
        this.description = '';
        this.urls = [];
    }
    __decorate([
        (0, class_validator_1.Length)(1),
        __metadata("design:type", String)
    ], CreateProjectPayload.prototype, "name");
    return CreateProjectPayload;
}());
exports.CreateProjectPayload = CreateProjectPayload;
var Project = /** @class */ (function () {
    function Project() {
        this.id = -1;
        this.name = '';
        this.description = '';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Project.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Project.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Project.prototype, "description");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Project.prototype, "createdAt");
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Date)
    ], Project.prototype, "updatedAt");
    Project = __decorate([
        (0, typeorm_1.Entity)()
    ], Project);
    return Project;
}());
exports.Project = Project;
exports["default"] = Project;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcHJvamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBaUU7QUFDakUsbURBQXlDO0FBRXpDO0lBQUE7UUFFUyxTQUFJLEdBQVcsRUFBRSxDQUFDO1FBRWxCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBRXpCLFNBQUksR0FBYSxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQU5DO1FBQUMsSUFBQSx3QkFBTSxFQUFDLENBQUMsQ0FBQzs7OENBQ2U7SUFLM0IsMkJBQUM7Q0FBQSxBQVBELElBT0M7QUFQWSxvREFBb0I7QUFVakM7SUFBQTtRQUVTLE9BQUUsR0FBVyxDQUFDLENBQUMsQ0FBQztRQUdoQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBR2xCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBR3pCLGNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO1FBRzdCLGNBQVMsR0FBUyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3RDLENBQUM7SUFkQztRQUFDLElBQUEsZ0NBQXNCLEdBQUU7OytCQUNGO0lBRXZCO1FBQUMsSUFBQSxnQkFBTSxHQUFFOztpQ0FDZ0I7SUFFekI7UUFBQyxJQUFBLGdCQUFNLEdBQUU7O3dDQUN1QjtJQUVoQztRQUFDLElBQUEsZ0JBQU0sR0FBRTtrQ0FDUyxJQUFJO3NDQUFjO0lBRXBDO1FBQUMsSUFBQSxnQkFBTSxHQUFFO2tDQUNTLElBQUk7c0NBQWM7SUFkekIsT0FBTztRQURuQixJQUFBLGdCQUFNLEdBQUU7T0FDSSxPQUFPLENBZW5CO0lBQUQsY0FBQztDQUFBLEFBZkQsSUFlQztBQWZZLDBCQUFPO0FBaUJwQixxQkFBZSxPQUFPLENBQUMifQ==
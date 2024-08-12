var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PlanType_1;
import { ExerciseType } from "./ExerciseType.js";
import { Model } from './Model.js';
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
let PlanType = PlanType_1 = class PlanType extends Model {
    constructor(jsonData) {
        super();
        const databaseNames = getMetadataForProperties(PlanType_1);
        this.PlanId = jsonData[databaseNames["PlanId"]];
        this.ExerciseType = jsonData[databaseNames["ExerciseType"]];
    }
};
__decorate([
    Column("plan_id"),
    __metadata("design:type", Number)
], PlanType.prototype, "PlanId", void 0);
__decorate([
    ForeignKey(ExerciseType),
    Column("exercise_type_id"),
    __metadata("design:type", ExerciseType)
], PlanType.prototype, "ExerciseType", void 0);
PlanType = PlanType_1 = __decorate([
    Table("address"),
    PrimaryKey("plan_id"),
    __metadata("design:paramtypes", [Object])
], PlanType);
export { PlanType };

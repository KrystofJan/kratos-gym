var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExerciseType_1;
import { Model } from './Model.js';
import { Column, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
let ExerciseType = ExerciseType_1 = class ExerciseType extends Model {
    constructor(jsonData) {
        super();
        const databaseNames = getMetadataForProperties(ExerciseType_1);
        this.ExerciseTypeId = jsonData[databaseNames["City"]];
        this.ExerciseTypeName = jsonData[databaseNames["ExerciseTypeName"]];
        this.Category = jsonData[databaseNames["Category"]];
        this.BodyPart = jsonData[databaseNames["BodyPart"]];
    }
};
__decorate([
    Column("exercise_type_id"),
    __metadata("design:type", Object)
], ExerciseType.prototype, "ExerciseTypeId", void 0);
__decorate([
    Column("exercise_type_name"),
    __metadata("design:type", String)
], ExerciseType.prototype, "ExerciseTypeName", void 0);
__decorate([
    Column("category"),
    __metadata("design:type", String)
], ExerciseType.prototype, "Category", void 0);
__decorate([
    Column("body_part"),
    __metadata("design:type", String)
], ExerciseType.prototype, "BodyPart", void 0);
ExerciseType = ExerciseType_1 = __decorate([
    Table("exercise_type"),
    PrimaryKey("exercise_type_id"),
    __metadata("design:paramtypes", [Object])
], ExerciseType);
export { ExerciseType };

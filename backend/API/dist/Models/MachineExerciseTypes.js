var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MachineExerciseTypes_1;
import { Model } from './Model.js';
import { ExerciseType } from './ExerciseType.js';
import { Machine } from './Machine.js';
import { Column, ForeignKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
let MachineExerciseTypes = MachineExerciseTypes_1 = class MachineExerciseTypes extends Model {
    constructor(jsonData) {
        super();
        const databaseNames = getMetadataForProperties(MachineExerciseTypes_1);
        this.ExerciseType = jsonData[databaseNames["ExerciseType"]];
        this.Machine = jsonData[databaseNames["Machine"]];
    }
};
__decorate([
    ForeignKey(ExerciseType),
    Column("exercise_type_id"),
    __metadata("design:type", ExerciseType)
], MachineExerciseTypes.prototype, "ExerciseType", void 0);
__decorate([
    ForeignKey(Machine),
    Column("machine_id"),
    __metadata("design:type", Machine)
], MachineExerciseTypes.prototype, "Machine", void 0);
MachineExerciseTypes = MachineExerciseTypes_1 = __decorate([
    Table("machine_exercise_type"),
    __metadata("design:paramtypes", [Object])
], MachineExerciseTypes);
export { MachineExerciseTypes };

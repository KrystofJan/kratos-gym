var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PlanMachinePreset_1;
import { Model } from './Model.js';
import { Machine } from './Machine.js';
import { PlanPreset } from './PlanPreset.js';
import { Column, ForeignKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
let PlanMachinePreset = PlanMachinePreset_1 = class PlanMachinePreset extends Model {
    constructor(jsonData) {
        super();
        const databaseNames = getMetadataForProperties(PlanMachinePreset_1);
        this.PlanPreset = jsonData[databaseNames["PlanPreset"]];
        this.Machine = jsonData[databaseNames["Machine"]];
        this.Sets = jsonData[databaseNames["Sets"]];
        this.Reps = jsonData[databaseNames["Reps"]];
    }
};
__decorate([
    ForeignKey(PlanPreset),
    Column("plan_preset_id"),
    __metadata("design:type", PlanPreset)
], PlanMachinePreset.prototype, "PlanPreset", void 0);
__decorate([
    ForeignKey(Machine),
    Column("machine_id"),
    __metadata("design:type", Machine)
], PlanMachinePreset.prototype, "Machine", void 0);
__decorate([
    Column("sets"),
    __metadata("design:type", Number)
], PlanMachinePreset.prototype, "Sets", void 0);
__decorate([
    Column("reps"),
    __metadata("design:type", Number)
], PlanMachinePreset.prototype, "Reps", void 0);
PlanMachinePreset = PlanMachinePreset_1 = __decorate([
    Table("plan_machine_prest"),
    __metadata("design:paramtypes", [Object])
], PlanMachinePreset);
export { PlanMachinePreset };

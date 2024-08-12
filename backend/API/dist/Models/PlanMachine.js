var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PlanMachine_1;
import { Model } from './Model.js';
import { Machine } from "./Machine.js";
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
let PlanMachine = PlanMachine_1 = class PlanMachine extends Model {
    constructor(jsonData) {
        var _a;
        super();
        const databaseNames = getMetadataForProperties(PlanMachine_1);
        this.PlanId = jsonData[databaseNames["PlanId"]];
        this.Sets = jsonData[databaseNames["Sets"]];
        this.Reps = jsonData[databaseNames["Reps"]];
        this.StartTime = jsonData[databaseNames["StartTime"]];
        this.EndTime = jsonData[databaseNames["EndTime"]];
        this.CanDisturb = jsonData[databaseNames["CanDisturb"]];
        this.Machine = (_a = jsonData[databaseNames["Machine"]]) !== null && _a !== void 0 ? _a : null;
    }
};
__decorate([
    Column("plan_id"),
    __metadata("design:type", Number)
], PlanMachine.prototype, "PlanId", void 0);
__decorate([
    ForeignKey(Machine),
    Column("machine_id"),
    __metadata("design:type", Object)
], PlanMachine.prototype, "Machine", void 0);
__decorate([
    Column("sets"),
    __metadata("design:type", Number)
], PlanMachine.prototype, "Sets", void 0);
__decorate([
    Column("reps"),
    __metadata("design:type", Number)
], PlanMachine.prototype, "Reps", void 0);
__decorate([
    Column("start_time"),
    __metadata("design:type", Date)
], PlanMachine.prototype, "StartTime", void 0);
__decorate([
    Column("end_time"),
    __metadata("design:type", Date)
], PlanMachine.prototype, "EndTime", void 0);
__decorate([
    Column("can_disturb"),
    __metadata("design:type", Boolean)
], PlanMachine.prototype, "CanDisturb", void 0);
PlanMachine = PlanMachine_1 = __decorate([
    Table("plan_machine"),
    PrimaryKey("plan_id"),
    __metadata("design:paramtypes", [Object])
], PlanMachine);
export { PlanMachine };

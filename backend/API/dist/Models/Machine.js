var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Machine_1;
import { Model } from './Model.js';
import { Column, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
let Machine = Machine_1 = class Machine extends Model {
    constructor(jsonData) {
        var _a, _b, _c, _d;
        super();
        const databaseNames = getMetadataForProperties(Machine_1);
        this.MachineId = (_a = jsonData[databaseNames["MachineId"]]) !== null && _a !== void 0 ? _a : null;
        this.MachineName = jsonData[databaseNames["MachineName"]];
        this.MaxWeight = (_b = jsonData[databaseNames["MaxWeight"]]) !== null && _b !== void 0 ? _b : 0;
        this.MinWeight = (_c = jsonData[databaseNames["MinWeight"]]) !== null && _c !== void 0 ? _c : 0;
        this.MaxPeople = jsonData[databaseNames["MaxPeople"]];
        this.AvgTimeTaken = jsonData[databaseNames["AvgTimeTaken"]];
        this.PopularityScore = (_d = jsonData[databaseNames["PopularityScore"]]) !== null && _d !== void 0 ? _d : 0;
    }
};
__decorate([
    Column("machine_id"),
    __metadata("design:type", Object)
], Machine.prototype, "MachineId", void 0);
__decorate([
    Column("machine_name"),
    __metadata("design:type", String)
], Machine.prototype, "MachineName", void 0);
__decorate([
    Column("max_weight"),
    __metadata("design:type", Number)
], Machine.prototype, "MaxWeight", void 0);
__decorate([
    Column("min_weight"),
    __metadata("design:type", Number)
], Machine.prototype, "MinWeight", void 0);
__decorate([
    Column("max_people"),
    __metadata("design:type", Number)
], Machine.prototype, "MaxPeople", void 0);
__decorate([
    Column("avg_time_taken"),
    __metadata("design:type", Number)
], Machine.prototype, "AvgTimeTaken", void 0);
__decorate([
    Column("popularity_score"),
    __metadata("design:type", Number)
], Machine.prototype, "PopularityScore", void 0);
Machine = Machine_1 = __decorate([
    Table("machine"),
    PrimaryKey("machine_id"),
    __metadata("design:paramtypes", [Object])
], Machine);
export { Machine };

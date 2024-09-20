var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Model } from './Model.js';
import { Column, PrimaryKey, Table } from "./Decorators/DatabaseDecorators.js";
let Machine = class Machine extends Model {
    constructor(jsonData) {
        var _a, _b, _c, _d, _e, _f, _g;
        super();
        this.MachineId = (_a = jsonData["MachineId"]) !== null && _a !== void 0 ? _a : jsonData["machine_id"];
        this.MachineName = (_b = jsonData["MachineName"]) !== null && _b !== void 0 ? _b : jsonData["machine_name"];
        this.MaxWeight = (_c = jsonData["MaxWeight"]) !== null && _c !== void 0 ? _c : jsonData["max_weight"];
        this.MinWeight = (_d = jsonData["MinWeight"]) !== null && _d !== void 0 ? _d : jsonData["min_weight"];
        this.MaxPeople = (_e = jsonData["MaxPeople"]) !== null && _e !== void 0 ? _e : jsonData["max_people"];
        this.AvgTimeTaken = (_f = jsonData["AvgTimeTaken"]) !== null && _f !== void 0 ? _f : jsonData["avg_time_taken"];
        this.PopularityScore = (_g = jsonData["PopularityScore"]) !== null && _g !== void 0 ? _g : jsonData["popularity_score"];
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
Machine = __decorate([
    Table("machine"),
    PrimaryKey("machine_id"),
    __metadata("design:paramtypes", [Object])
], Machine);
export { Machine };

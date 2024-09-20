var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PlanPreset_1;
import { Model } from './Model.js';
import { Account } from './Account.js';
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
let PlanPreset = PlanPreset_1 = class PlanPreset extends Model {
    constructor(jsonData) {
        super();
        const databaseNames = getMetadataForProperties(PlanPreset_1);
        this.PlanPresetId = jsonData[databaseNames["PlanPresetId"]];
        this.PresetName = jsonData[databaseNames["PresetName"]];
        this.Author = jsonData[databaseNames["Author"]];
    }
};
__decorate([
    Column("plan_preset_id"),
    __metadata("design:type", Number)
], PlanPreset.prototype, "PlanPresetId", void 0);
__decorate([
    Column("preset_name"),
    __metadata("design:type", String)
], PlanPreset.prototype, "PresetName", void 0);
__decorate([
    ForeignKey(Account),
    Column("author_id"),
    __metadata("design:type", Account)
], PlanPreset.prototype, "Author", void 0);
PlanPreset = PlanPreset_1 = __decorate([
    Table("plan_preset"),
    PrimaryKey("plan_preset_id"),
    __metadata("design:paramtypes", [Object])
], PlanPreset);
export { PlanPreset };

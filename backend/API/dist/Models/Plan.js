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
import { Account } from './Account.js';
import { Column, ForeignKey, PrimaryKey, Table } from "./Decorators/DatabaseDecorators.js";
let Plan = class Plan extends Model {
    constructor(jsonData) {
        var _a, _b;
        super();
        this.PlanId = (_a = jsonData["plan_id"]) !== null && _a !== void 0 ? _a : jsonData["PlanId"];
        this.PlanName = (_b = jsonData["plan_name"]) !== null && _b !== void 0 ? _b : jsonData["PlanName"];
        if (jsonData["Account"]) {
            this.User = jsonData["Account"];
        }
        else {
            this.User = new Account(jsonData);
        }
    }
};
__decorate([
    Column("plan_id"),
    __metadata("design:type", Number)
], Plan.prototype, "PlanId", void 0);
__decorate([
    Column("plan_name"),
    __metadata("design:type", String)
], Plan.prototype, "PlanName", void 0);
__decorate([
    ForeignKey(Account),
    Column("account_id"),
    __metadata("design:type", Object)
], Plan.prototype, "User", void 0);
Plan = __decorate([
    Table("plan"),
    PrimaryKey("plan_id"),
    __metadata("design:paramtypes", [Object])
], Plan);
export { Plan };

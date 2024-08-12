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
import { Plan } from './Plan.js';
import { Column, ForeignKey, PrimaryKey, Table } from "./Decorators/DatabaseDecorators.js";
let Reservation = class Reservation extends Model {
    constructor(jsonData) {
        var _a, _b, _c, _d, _e, _f;
        super();
        this.ReservationId = (_a = jsonData["reservation_id"]) !== null && _a !== void 0 ? _a : jsonData["ReservationId"];
        this.AmountOfPeople = (_b = jsonData["amount_of_people"]) !== null && _b !== void 0 ? _b : jsonData["AmoutOfPeople"];
        this.ReservationTime = (_c = jsonData["reservation_time"]) !== null && _c !== void 0 ? _c : jsonData["ReservationTime"];
        this.Customer = (_d = jsonData["customer"]) !== null && _d !== void 0 ? _d : jsonData["Customer"];
        this.Trainer = (_e = jsonData["Trainer"]) !== null && _e !== void 0 ? _e : null;
        this.Plan = (_f = jsonData["Plan"]) !== null && _f !== void 0 ? _f : null;
    }
};
__decorate([
    Column("resetvation_id"),
    __metadata("design:type", Number)
], Reservation.prototype, "ReservationId", void 0);
__decorate([
    Column("amount_of_people"),
    __metadata("design:type", Number)
], Reservation.prototype, "AmountOfPeople", void 0);
__decorate([
    Column("reservation_time"),
    __metadata("design:type", Date)
], Reservation.prototype, "ReservationTime", void 0);
__decorate([
    ForeignKey(Account),
    Column("customer_id"),
    __metadata("design:type", Object)
], Reservation.prototype, "Customer", void 0);
__decorate([
    ForeignKey(Account),
    Column("trainer_id"),
    __metadata("design:type", Object)
], Reservation.prototype, "Trainer", void 0);
__decorate([
    ForeignKey(Plan),
    Column("plan_id"),
    __metadata("design:type", Object)
], Reservation.prototype, "Plan", void 0);
Reservation = __decorate([
    Table("reservation"),
    PrimaryKey("resetvation_id"),
    __metadata("design:paramtypes", [Object])
], Reservation);
export { Reservation };

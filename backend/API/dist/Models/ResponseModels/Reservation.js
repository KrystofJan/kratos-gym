var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { User } from './User.js';
import { WrkOutPlan } from './WrkOutPlan.js';
var Reservation = /** @class */ (function (_super) {
    __extends(Reservation, _super);
    function Reservation(jsonData) {
        var _a;
        var _this = _super.call(this) || this;
        _this.ReservationId = jsonData.ReservetionId;
        _this.AmmountOfPeople = jsonData.AmmoutOfPeople;
        _this.ReservationTime = jsonData.ReservationTime;
        _this.Customer = jsonData.Customer;
        _this.Trainer = (_a = jsonData.Trainer) !== null && _a !== void 0 ? _a : null;
        _this.WrkOutPlan = jsonData.WrkOutPlan;
        return _this;
    }
    __decorate([
        PrimaryIdentifier(),
        __metadata("design:type", Number)
    ], Reservation.prototype, "ReservationId", void 0);
    __decorate([
        ForeignIdentifier("UserId"),
        __metadata("design:type", User)
    ], Reservation.prototype, "Customer", void 0);
    __decorate([
        ForeignIdentifier("UserId"),
        __metadata("design:type", Object)
    ], Reservation.prototype, "Trainer", void 0);
    __decorate([
        ForeignIdentifier("WrkOutPlan"),
        __metadata("design:type", WrkOutPlan)
    ], Reservation.prototype, "WrkOutPlan", void 0);
    return Reservation;
}(Model));
export { Reservation };

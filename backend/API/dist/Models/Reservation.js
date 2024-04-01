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
import { Model } from './Model.js';
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
    return Reservation;
}(Model));
export { Reservation };

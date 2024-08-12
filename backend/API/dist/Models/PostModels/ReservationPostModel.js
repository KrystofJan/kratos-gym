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
import { Model } from '../Model.js';
var ReservationPostModel = /** @class */ (function (_super) {
    __extends(ReservationPostModel, _super);
    function ReservationPostModel(jsonData) {
        var _a;
        var _this = _super.call(this) || this;
        _this.amount_of_people = jsonData.AmoutOfPeople;
        _this.reservation_time = jsonData.ReservationTime;
        _this.customer_id = jsonData.CustomerId;
        _this.trainer_id = (_a = jsonData.TrainerId) !== null && _a !== void 0 ? _a : null;
        _this.plan_id = jsonData.PlanId;
        return _this;
    }
    return ReservationPostModel;
}(Model));
export { ReservationPostModel };

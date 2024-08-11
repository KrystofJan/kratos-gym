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
var PlanMachine = /** @class */ (function (_super) {
    __extends(PlanMachine, _super);
    function PlanMachine(jsonData) {
        var _a;
        var _this = _super.call(this) || this;
        _this.PlanId = jsonData.PlanId;
        _this.Sets = jsonData.sets;
        _this.Reps = jsonData.reps;
        _this.StartTime = jsonData.StartTime;
        _this.EndTime = jsonData.EndTime;
        _this.CanDisturb = jsonData.CanDisturb;
        _this.Machine = (_a = jsonData.Machine) !== null && _a !== void 0 ? _a : null;
        return _this;
    }
    return PlanMachine;
}(Model));
export { PlanMachine };

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
var WrkOutPlanMachine = /** @class */ (function (_super) {
    __extends(WrkOutPlanMachine, _super);
    function WrkOutPlanMachine(jsonData) {
        var _this = _super.call(this) || this;
        _this.WrkOutPlan = jsonData.WrkOutPlan;
        _this.WrkOutMachine = jsonData.WrkOutMachine;
        _this.Sets = jsonData.Sets;
        _this.Reps = jsonData.Reps;
        _this.WrkOutStartTime = jsonData.WrkOutStartTime;
        _this.WrkOutEndTime = jsonData.WrkOutEndTime;
        _this.CanDisturb = jsonData.CanDisturb;
        return _this;
    }
    return WrkOutPlanMachine;
}(Model));
export { WrkOutPlanMachine };

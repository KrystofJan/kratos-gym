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
var PlanMachinePostModel = /** @class */ (function (_super) {
    __extends(PlanMachinePostModel, _super);
    function PlanMachinePostModel(jsonData) {
        var _this = _super.call(this) || this;
        _this.wrkoutmachine_id = jsonData.MachineId;
        _this.wrkoutplan_id = jsonData.Pland;
        _this.sets = jsonData.Sets;
        _this.reps = jsonData.Reps;
        _this.start_time = jsonData.StartTime;
        _this.end_time = jsonData.EndTime;
        _this.can_disturb = jsonData.CanDisturb;
        return _this;
    }
    return PlanMachinePostModel;
}(Model));
export { PlanMachinePostModel };

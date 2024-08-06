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
var WrkOutPlanMachinePostModel = /** @class */ (function (_super) {
    __extends(WrkOutPlanMachinePostModel, _super);
    function WrkOutPlanMachinePostModel(jsonData) {
        var _this = _super.call(this) || this;
        _this.wrkoutmachine_id = jsonData.WrkOutMachineId;
        _this.wrkoutplan_id = jsonData.WrkOutPland;
        _this.sets = jsonData.Sets;
        _this.reps = jsonData.Reps;
        _this.wrkout_start_time = jsonData.WrkOutStartTime;
        _this.wrkout_end_time = jsonData.WrkOutEndTime;
        _this.can_disturb = jsonData.CanDisturb;
        return _this;
    }
    return WrkOutPlanMachinePostModel;
}(Model));
export { WrkOutPlanMachinePostModel };

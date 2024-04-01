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
        _this.WrkOutMachineId = jsonData.WrkOutMachineId;
        _this.WrkOutPlanId = jsonData.WrkOutPland;
        _this.Sets = jsonData.Sets;
        _this.Reps = jsonData.Reps;
        _this.WrkOutStartTime = jsonData.WrkOutStartTime;
        _this.WrkOutEndTime = jsonData.WrkOutEndTime;
        _this.CanDisturb = jsonData.CanDisturb;
        return _this;
    }
    return WrkOutPlanMachinePostModel;
}(Model));
export { WrkOutPlanMachinePostModel };

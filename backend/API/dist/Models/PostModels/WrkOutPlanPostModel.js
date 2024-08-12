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
var WrkOutPlanPostModel = /** @class */ (function (_super) {
    __extends(WrkOutPlanPostModel, _super);
    function WrkOutPlanPostModel(jsonData) {
        var _this = _super.call(this) || this;
        _this.planname = jsonData.PlanName;
        _this.accountid = jsonData.AccountId;
        return _this;
    }
    return WrkOutPlanPostModel;
}(Model));
export { WrkOutPlanPostModel };

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
var WrkOutMachinePostModel = /** @class */ (function (_super) {
    __extends(WrkOutMachinePostModel, _super);
    function WrkOutMachinePostModel(jsonData) {
        var _this = _super.call(this) || this;
        _this.MachineName = jsonData.MachineName;
        _this.MaxWeight = jsonData.MaxWeight;
        _this.MinWeight = jsonData.MinWeight;
        _this.MaxPeople = jsonData.MaxPeople;
        _this.AvgTimeTaken = jsonData.AvgTimeTaken;
        _this.PopularityScore = jsonData.PopularityScore;
        return _this;
    }
    return WrkOutMachinePostModel;
}(Model));
export { WrkOutMachinePostModel };

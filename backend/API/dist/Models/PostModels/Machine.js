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
var MachinePostModel = /** @class */ (function (_super) {
    __extends(MachinePostModel, _super);
    function MachinePostModel(jsonData) {
        var _this = _super.call(this) || this;
        _this.machine_name = jsonData.MachineName;
        _this.max_weight = jsonData.MaxWeight;
        _this.min_weight = jsonData.MinWeight;
        _this.max_people = jsonData.MaxPeople;
        _this.avg_time_taken = jsonData.AvgTimeTaken;
        _this.popularity_score = jsonData.PopularityScore;
        return _this;
    }
    return MachinePostModel;
}(Model));
export { MachinePostModel };

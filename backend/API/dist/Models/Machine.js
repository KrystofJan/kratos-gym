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
var Machine = /** @class */ (function (_super) {
    __extends(Machine, _super);
    function Machine(jsonData) {
        var _a, _b, _c, _d;
        var _this = _super.call(this) || this;
        _this.MachineId = (_a = jsonData.MachineId) !== null && _a !== void 0 ? _a : null;
        _this.MachineName = jsonData.MachineName;
        _this.MaxWeight = (_b = jsonData.MaxWeight) !== null && _b !== void 0 ? _b : 0;
        _this.MinWeight = (_c = jsonData.MinWeight) !== null && _c !== void 0 ? _c : 0;
        _this.MaxPeople = jsonData.MaxPeople;
        _this.AvgTimeTaken = jsonData.AvgTimeTaken;
        _this.PopularityScore = (_d = jsonData.PopularityScore) !== null && _d !== void 0 ? _d : 0;
        return _this;
    }
    return Machine;
}(Model));
export { Machine };

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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForeignIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { WrkOutMachine } from './WrkOutMachine.js';
import { WrkOutPlanPreset } from './WrkOutPlanPreset.js';
var WrkOutPlanMachinePreset = /** @class */ (function (_super) {
    __extends(WrkOutPlanMachinePreset, _super);
    function WrkOutPlanMachinePreset(jsonData) {
        var _this = _super.call(this) || this;
        _this.WrkOutPlanPreset = jsonData.WrkOutPlanPreset;
        _this.WrkOutMachine = jsonData.WrkOutMachine;
        _this.Sets = jsonData.Sets;
        _this.Reps = jsonData.Reps;
        return _this;
    }
    __decorate([
        ForeignIdentifier("WrkOutPlanPresetId"),
        __metadata("design:type", WrkOutPlanPreset)
    ], WrkOutPlanMachinePreset.prototype, "WrkOutPlanPreset", void 0);
    __decorate([
        ForeignIdentifier("WrkOutMachineId"),
        __metadata("design:type", WrkOutMachine)
    ], WrkOutPlanMachinePreset.prototype, "WrkOutMachine", void 0);
    return WrkOutPlanMachinePreset;
}(Model));
export { WrkOutPlanMachinePreset };

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
import { Model } from '../Model.js';
import { PrimaryIdentifier } from '../Decorators/IdentifierDecorator.js';
var Address = /** @class */ (function (_super) {
    __extends(Address, _super);
    function Address(jsonData) {
        var _a;
        var _this = _super.call(this) || this;
        _this.AddressId = (_a = jsonData.AddressId) !== null && _a !== void 0 ? _a : null;
        _this.Street = jsonData.Street;
        _this.City = jsonData.City;
        _this.PostalCode = jsonData.PostalCode;
        _this.Country = jsonData.Country;
        _this.BuildingNumber = jsonData.BuildingNumber;
        _this.ApartmentNumber = jsonData.ApartmentNumber;
        return _this;
    }
    __decorate([
        PrimaryIdentifier(),
        __metadata("design:type", Object)
    ], Address.prototype, "AddressId", void 0);
    return Address;
}(Model));
export { Address };

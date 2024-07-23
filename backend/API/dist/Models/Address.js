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
var Address = /** @class */ (function (_super) {
    __extends(Address, _super);
    function Address(jsonData) {
        var _a;
        var _this = _super.call(this) || this;
        _this.AddressId = (_a = jsonData.addressid) !== null && _a !== void 0 ? _a : null;
        _this.Street = jsonData.street;
        _this.City = jsonData.city;
        _this.PostalCode = jsonData.postalcode;
        _this.Country = jsonData.country;
        _this.BuildingNumber = jsonData.buildingnumber;
        _this.ApartmentNumber = jsonData.apartmentnumber;
        return _this;
    }
    return Address;
}(Model));
export { Address };

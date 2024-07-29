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
var AddressPostModel = /** @class */ (function (_super) {
    __extends(AddressPostModel, _super);
    function AddressPostModel(jsonData) {
        var _this = _super.call(this) || this;
        _this.street = jsonData.street;
        _this.city = jsonData.city;
        _this.postalcode = jsonData.postalcode;
        _this.country = jsonData.country;
        _this.buildingnumber = jsonData.buildingnumber;
        _this.apartmentnumber = jsonData.apartmentnumber;
        return _this;
    }
    return AddressPostModel;
}(Model));
export { AddressPostModel };

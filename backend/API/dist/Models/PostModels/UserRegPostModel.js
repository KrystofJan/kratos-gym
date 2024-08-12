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
var UserRegPostModel = /** @class */ (function (_super) {
    __extends(UserRegPostModel, _super);
    function UserRegPostModel(jsonData) {
        var _this = _super.call(this) || this;
        _this.first_name = jsonData.FirstName;
        _this.last_name = jsonData.LastName;
        _this.address_id = jsonData.AddressId;
        _this.email = jsonData.Email;
        _this.phone_number = jsonData.PhoneNumber;
        _this.password = jsonData.Password;
        _this.login = jsonData.login;
        return _this;
    }
    return UserRegPostModel;
}(Model));
export { UserRegPostModel };

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
export var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "c";
    UserRole["TRAINER"] = "t";
    UserRole["EMPLOYEE"] = "e";
})(UserRole || (UserRole = {}));
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User(jsonData) {
        var _a;
        var _this = _super.call(this) || this;
        _this.UserId = jsonData.UserId;
        _this.FirstName = jsonData.FirstName;
        _this.LastName = jsonData.LastName;
        switch (jsonData.Role) {
            case 'c': {
                _this.Role = UserRole.CUSTOMER;
                break;
            }
            case 't': {
                _this.Role = UserRole.TRAINER;
                break;
            }
            case 'e': {
                _this.Role = UserRole.EMPLOYEE;
                break;
            }
            default: {
                throw new Error("Unknown user role");
            }
        }
        _this.Email = jsonData.Email;
        _this.PhoneNumber = jsonData.PhoneNumber;
        _this.IsActive = (jsonData.IsActive) ? jsonData.IsActive : true;
        _this.CreateDate = (jsonData.CreateDate) ? jsonData.CreateDate : '';
        _this.LastOnline = (jsonData.LastOnline) ? jsonData.LastOnline : '';
        _this.Password = jsonData.Password;
        _this.Address = jsonData.Address;
        _this.Credits = (_a = jsonData.credits) !== null && _a !== void 0 ? _a : 0;
        return _this;
    }
    return User;
}(Model));
export { User };
module.exports = User;

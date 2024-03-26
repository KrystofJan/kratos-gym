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
    UserRole["TRAINER"] = "T";
    UserRole["EMPLOYEE"] = "E";
    UserRole["USER"] = "U";
    UserRole["NOTKNOWN"] = "/";
})(UserRole || (UserRole = {}));
export var UserAttrs;
(function (UserAttrs) {
    UserAttrs["UserId"] = "UserId";
    UserAttrs["FirstName"] = "FirstName";
    UserAttrs["LastName"] = "LastName";
    UserAttrs["Role"] = "Role";
    UserAttrs["Email"] = "Email";
    UserAttrs["PhoneNumber"] = "PhoneNumber";
    UserAttrs["IsActive"] = "IsActive";
    UserAttrs["CreateDate"] = "CreateDate";
    UserAttrs["LastOnline"] = "LastOnline";
    UserAttrs["Password"] = "Password";
    UserAttrs["Address"] = "Address";
    UserAttrs["Credits"] = "Credits";
    UserAttrs["Login"] = "Login";
})(UserAttrs || (UserAttrs = {}));
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User(jsonData) {
        var _a, _b;
        var _this = _super.call(this) || this;
        _this.UserId = jsonData.UserId;
        _this.FirstName = jsonData.FirstName;
        _this.LastName = jsonData.LastName;
        _this.Role = UserRole.CUSTOMER;
        switch (jsonData.Role) {
            case UserRole.CUSTOMER: {
                _this.Role = UserRole.CUSTOMER;
                break;
            }
            case UserRole.TRAINER: {
                _this.Role = UserRole.TRAINER;
                break;
            }
            case UserRole.EMPLOYEE: {
                _this.Role = UserRole.EMPLOYEE;
                break;
            }
            case UserRole.USER: {
                _this.Role = UserRole.USER;
                break;
            }
            // default: {
            //     throw new Error(`Unknown user role ${jsonData.Role}`);
            // }
        }
        _this.Email = jsonData.Email;
        _this.PhoneNumber = jsonData.PhoneNumber;
        _this.IsActive = (jsonData.IsActive) ? jsonData.IsActive : true;
        _this.CreateDate = (jsonData.CreateDate) ? jsonData.CreateDate : '';
        _this.LastOnline = (jsonData.LastOnline) ? jsonData.LastOnline : '';
        _this.Password = jsonData.Password;
        _this.Address = (_a = jsonData.Address) !== null && _a !== void 0 ? _a : null;
        _this.Credits = (_b = jsonData.credits) !== null && _b !== void 0 ? _b : 0;
        _this.Login = jsonData.login;
        return _this;
    }
    return User;
}(Model));
export { User };

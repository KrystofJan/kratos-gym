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
var Account = /** @class */ (function (_super) {
    __extends(Account, _super);
    function Account(jsonData) {
        var _a, _b;
        var _this = _super.call(this) || this;
        _this.AccountId = jsonData.account_id;
        _this.FirstName = jsonData.first_name;
        _this.LastName = jsonData.last_name;
        _this.Role = UserRole.CUSTOMER;
        switch (jsonData.role) {
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
        _this.Email = jsonData.email;
        _this.PhoneNumber = jsonData.phone_number;
        _this.IsActive = (jsonData.isactive) ? jsonData.isactive : true;
        _this.CreateDate = (jsonData.create_date) ? jsonData.create_date : '';
        _this.LastOnline = (jsonData.last_online) ? jsonData.last_online : '';
        _this.Password = jsonData.password;
        _this.Address = (_a = jsonData.address) !== null && _a !== void 0 ? _a : null;
        _this.Credits = (_b = jsonData.credits) !== null && _b !== void 0 ? _b : 0;
        _this.Login = jsonData.login;
        return _this;
    }
    return Account;
}(Model));
export { Account };

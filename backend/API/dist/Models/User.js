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
export class Account extends Model {
    constructor(jsonData) {
        var _a, _b;
        super();
        this.AccountId = jsonData.account_id;
        this.FirstName = jsonData.first_name;
        this.LastName = jsonData.last_name;
        this.Role = UserRole.CUSTOMER;
        switch (jsonData.role) {
            case UserRole.CUSTOMER: {
                this.Role = UserRole.CUSTOMER;
                break;
            }
            case UserRole.TRAINER: {
                this.Role = UserRole.TRAINER;
                break;
            }
            case UserRole.EMPLOYEE: {
                this.Role = UserRole.EMPLOYEE;
                break;
            }
            case UserRole.USER: {
                this.Role = UserRole.USER;
                break;
            }
            // default: {
            //     throw new Error(`Unknown user role ${jsonData.Role}`);
            // }
        }
        this.Email = jsonData.email;
        this.PhoneNumber = jsonData.phone_number;
        this.IsActive = (jsonData.isactive) ? jsonData.isactive : true;
        this.CreateDate = (jsonData.create_date) ? jsonData.create_date : '';
        this.LastOnline = (jsonData.last_online) ? jsonData.last_online : '';
        this.Password = jsonData.password;
        this.Address = (_a = jsonData.address) !== null && _a !== void 0 ? _a : null;
        this.Credits = (_b = jsonData.credits) !== null && _b !== void 0 ? _b : 0;
        this.Login = jsonData.login;
    }
}

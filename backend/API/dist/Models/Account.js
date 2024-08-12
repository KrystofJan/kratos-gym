var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Address } from './Address.js';
import { Model } from './Model.js';
import { Column, ForeignKey, PrimaryKey, Table } from "./Decorators/DatabaseDecorators.js";
export var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "c";
    UserRole["TRAINER"] = "T";
    UserRole["EMPLOYEE"] = "E";
    UserRole["USER"] = "U";
    UserRole["NOTKNOWN"] = "/";
})(UserRole || (UserRole = {}));
let Account = class Account extends Model {
    constructor(jsonData) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        super();
        this.AccountId = (_a = jsonData["account_id"]) !== null && _a !== void 0 ? _a : jsonData["AccountId"];
        this.FirstName = (_b = jsonData["first_name"]) !== null && _b !== void 0 ? _b : jsonData["FirstName"];
        this.LastName = (_c = jsonData["last_name"]) !== null && _c !== void 0 ? _c : jsonData["LastName"];
        this.Role = UserRole.CUSTOMER;
        const role = (_d = jsonData["role"]) !== null && _d !== void 0 ? _d : jsonData["Role"];
        switch (role) {
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
        this.Email = (_e = jsonData["email"]) !== null && _e !== void 0 ? _e : jsonData["Email"];
        this.PhoneNumber = (_f = jsonData["phone_number"]) !== null && _f !== void 0 ? _f : jsonData["PhoneNumber"];
        const isActive = (_g = jsonData["is_active"]) !== null && _g !== void 0 ? _g : jsonData["isActive"];
        this.IsActive = (_h = (isActive)) !== null && _h !== void 0 ? _h : true;
        this.CreateDate = (_j = jsonData["create_date"]) !== null && _j !== void 0 ? _j : jsonData["CreateDate"];
        this.LastOnline = (_k = jsonData["last_online"]) !== null && _k !== void 0 ? _k : jsonData["LastOnline"];
        this.Password = (_l = jsonData["password"]) !== null && _l !== void 0 ? _l : jsonData["Password"];
        this.Credits = (_m = jsonData["credits"]) !== null && _m !== void 0 ? _m : jsonData["Credits"];
        this.Login = (_o = jsonData["login"]) !== null && _o !== void 0 ? _o : jsonData["Login"];
        if (jsonData["address"]) {
            this.Address = jsonData["address"];
        }
        else {
            this.Address = new Address(jsonData);
        }
    }
};
__decorate([
    Column("account_id"),
    __metadata("design:type", Number)
], Account.prototype, "AccountId", void 0);
__decorate([
    Column("first_name"),
    __metadata("design:type", String)
], Account.prototype, "FirstName", void 0);
__decorate([
    Column("last_name"),
    __metadata("design:type", String)
], Account.prototype, "LastName", void 0);
__decorate([
    Column("role"),
    __metadata("design:type", String)
], Account.prototype, "Role", void 0);
__decorate([
    Column("email"),
    __metadata("design:type", String)
], Account.prototype, "Email", void 0);
__decorate([
    Column("phone_number"),
    __metadata("design:type", String)
], Account.prototype, "PhoneNumber", void 0);
__decorate([
    Column("is_active"),
    __metadata("design:type", Boolean)
], Account.prototype, "IsActive", void 0);
__decorate([
    Column("create_date"),
    __metadata("design:type", Date)
], Account.prototype, "CreateDate", void 0);
__decorate([
    Column("last_online"),
    __metadata("design:type", Date)
], Account.prototype, "LastOnline", void 0);
__decorate([
    Column("password"),
    __metadata("design:type", String)
], Account.prototype, "Password", void 0);
__decorate([
    ForeignKey(Address),
    Column("address_id"),
    __metadata("design:type", Object)
], Account.prototype, "Address", void 0);
__decorate([
    Column("credits"),
    __metadata("design:type", Number)
], Account.prototype, "Credits", void 0);
__decorate([
    Column("login"),
    __metadata("design:type", String)
], Account.prototype, "Login", void 0);
Account = __decorate([
    Table("account"),
    PrimaryKey("account_id"),
    __metadata("design:paramtypes", [Object])
], Account);
export { Account };

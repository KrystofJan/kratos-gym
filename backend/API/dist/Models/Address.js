var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Model } from './Model.js';
import { Column, PrimaryKey, Table } from "./Decorators/DatabaseDecorators.js";
let Address = class Address extends Model {
    constructor(jsonData) {
        var _a, _b, _c, _d, _e, _f, _g;
        super();
        const addrId = (_a = jsonData["address_id"]) !== null && _a !== void 0 ? _a : jsonData["AddressId"];
        this.AddressId = addrId;
        this.Street = (_b = jsonData["street"]) !== null && _b !== void 0 ? _b : jsonData["Street"];
        this.City = (_c = jsonData["city"]) !== null && _c !== void 0 ? _c : jsonData["City"];
        this.PostalCode = (_d = jsonData["postal_code"]) !== null && _d !== void 0 ? _d : jsonData["PostalCode"];
        this.Country = (_e = jsonData["country"]) !== null && _e !== void 0 ? _e : jsonData["Country"];
        this.BuildingNumber = (_f = jsonData["building_number"]) !== null && _f !== void 0 ? _f : jsonData["BuildingNumber"];
        this.ApartmentNumber = (_g = jsonData["apartment_number"]) !== null && _g !== void 0 ? _g : jsonData["ApartmentNumber"];
    }
};
__decorate([
    Column("address_id"),
    __metadata("design:type", Object)
], Address.prototype, "AddressId", void 0);
__decorate([
    Column("street"),
    __metadata("design:type", String)
], Address.prototype, "Street", void 0);
__decorate([
    Column("city"),
    __metadata("design:type", String)
], Address.prototype, "City", void 0);
__decorate([
    Column("postal_code"),
    __metadata("design:type", String)
], Address.prototype, "PostalCode", void 0);
__decorate([
    Column("country"),
    __metadata("design:type", String)
], Address.prototype, "Country", void 0);
__decorate([
    Column("building_number"),
    __metadata("design:type", String)
], Address.prototype, "BuildingNumber", void 0);
__decorate([
    Column("apartment_number"),
    __metadata("design:type", String)
], Address.prototype, "ApartmentNumber", void 0);
Address = __decorate([
    Table("address"),
    PrimaryKey("address_id"),
    __metadata("design:paramtypes", [Object])
], Address);
export { Address };

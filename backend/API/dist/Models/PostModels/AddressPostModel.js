import { Model } from '../Model.js';
export class AddressPostModel extends Model {
    constructor(jsonData) {
        super();
        this.street = jsonData.Street;
        this.city = jsonData.City;
        this.postal_code = jsonData.PostalCode;
        this.country = jsonData.Country;
        this.building_number = jsonData.BuildingNumber;
        this.apartment_number = jsonData.ApartmentNumber;
    }
}

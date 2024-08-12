import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js'

export class AddressPostModel extends Model {
    public street: string;
    public city: string;
    public postal_code: string;
    public country: string;
    public building_number: string;
    public apartment_number: string;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.street = jsonData.Street;
        this.city = jsonData.City;
        this.postal_code = jsonData.PostalCode;
        this.country = jsonData.Country;
        this.building_number = jsonData.BuildingNumber;
        this.apartment_number = jsonData.ApartmentNumber;
    }
}

import { IDictionary } from "../../utils/Utilities.js";
import { Model } from './Model.js'

export class Address extends Model {
    AddressId: number | null;
    Street: string;
    City: string;
    PostalCode: string;
    Country: string;
    BuildingNumber: string;
    ApartmentNumber: string;

    constructor(jsonData: IDictionary<any>) {
        super();
    
        this.AddressId = jsonData.AddressId ?? null;
        this.Street = jsonData.Street;
        this.City = jsonData.City;
        this.PostalCode = jsonData.PostalCode;
        this.Country = jsonData.Country;
        this.BuildingNumber = jsonData.BuildingNumber;
        this.ApartmentNumber = jsonData.ApartmentNumber;
    }
}

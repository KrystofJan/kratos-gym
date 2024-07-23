import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js'

export class Address extends Model {
    public AddressId: number | null;
    public Street: string;
    public City: string;
    public PostalCode: string;
    public Country: string;
    public BuildingNumber: string;
    public ApartmentNumber: string;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.AddressId = jsonData.addressid ?? null;
        this.Street = jsonData.street;
        this.City = jsonData.city;
        this.PostalCode = jsonData.postalcode;
        this.Country = jsonData.country;
        this.BuildingNumber = jsonData.buildingnumber;
        this.ApartmentNumber = jsonData.apartmentnumber;
    }
}

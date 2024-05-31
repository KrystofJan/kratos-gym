import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js';
import { PrimaryIdentifier } from '../Decorators/IdentifierDecorator.js';

export class Address extends Model {

    @PrimaryIdentifier()
    public AddressId: number | null;
    public Street: string;
    public City: string;
    public PostalCode: string;
    public Country: string;
    public BuildingNumber: string;
    public ApartmentNumber: string;

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

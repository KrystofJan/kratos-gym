import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js';
import { PrimaryIdentifier } from '../Decorators/IdentifierDecorator.js';
import { Column, Table } from "../Decorators/ReflectionDecorators.js";

@Table("Address")
export class Address extends Model {

    @Column({ type: "number", columnName: "AddressId" })
    @PrimaryIdentifier()
    public AddressId: number | null;
    @Column({ type: "string", columnName: "Street" })
    public Street: string;
    @Column({ type: "string", columnName: "City" })
    public City: string;
    @Column({ type: "string", columnName: "PostalCode" })
    public PostalCode: string;
    @Column({ type: "string", columnName: "Country" })
    public Country: string;
    @Column({ type: "string", columnName: "BuildingNumber" })
    public BuildingNumber: string;
    @Column({ type: "string", columnName: "ApartmentNumber" })
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

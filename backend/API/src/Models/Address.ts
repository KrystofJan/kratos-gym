import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js'

export class Address extends Model {
    public addressid: number | null;
    public street: string;
    public city: string;
    public postalcode: string;
    public country: string;
    public buildingnumber: string;
    public apartmentnumber: string;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.addressid = jsonData.addressid ?? null;
        this.street = jsonData.street;
        this.city = jsonData.city;
        this.postalcode = jsonData.postalcode;
        this.country = jsonData.country;
        this.buildingnumber = jsonData.buildingnumber;
        this.apartmentnumber = jsonData.apartmentnumber;
    }
}

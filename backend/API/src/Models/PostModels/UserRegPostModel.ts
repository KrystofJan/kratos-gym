import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';


export class UserRegPostModel extends Model {
    public first_name: string;
    public last_name: string;
    public email: string;
    public phone_number: string;
    public password: string;
    public login: string;
    public address_id: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.first_name = jsonData.FirstName;
        this.last_name = jsonData.LastName;
        this.address_id = jsonData.AddressId;
        this.email = jsonData.Email;
        this.phone_number = jsonData.PhoneNumber;
        this.password = jsonData.Password;
        this.login = jsonData.login;
    }
}

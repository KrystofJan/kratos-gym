import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';


export class UserRegPostModel extends Model {
    public FirstName: string;
    public LastName: string;
    public Email: string;
    public PhoneNumber: string;
    public Password: string;
    public Login: string;
    public AddressId: number;

    constructor(jsonData: IDictionary<any>){
        super();
        this.FirstName = jsonData.FirstName;
        this.LastName = jsonData.LastName;
        this.AddressId = jsonData.AddressId;
        this.Email = jsonData.Email;
        this.PhoneNumber = jsonData.PhoneNumber;
        this.Password = jsonData.Password;
        this.Login = jsonData.login;
    }    
}

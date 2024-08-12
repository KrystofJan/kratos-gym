import { Model } from '../Model.js';
export class UserRegPostModel extends Model {
    constructor(jsonData) {
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

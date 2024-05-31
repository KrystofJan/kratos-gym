import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class UserAuth extends Model {
    public LoginOrEmail: string;
    public EncodedPassword: string;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.LoginOrEmail = jsonData.LoginOrEmail;
        this.EncodedPassword = (jsonData.EncodedPassword) ? jsonData.EncodedPassword : '';
    }
}

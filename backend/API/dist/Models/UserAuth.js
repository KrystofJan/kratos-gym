import { Model } from './Model.js';
export class UserAuth extends Model {
    constructor(jsonData) {
        super();
        this.LoginOrEmail = jsonData.LoginOrEmail;
        this.EncodedPassword = (jsonData.EncodedPassword) ? jsonData.EncodedPassword : '';
    }
}

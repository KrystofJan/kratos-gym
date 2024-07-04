import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

@Table("User")
export class UserRegPostModel extends Model {
    @Column({ type: "string", columnName: "FirstName" })
    public FirstName: string;

    @Column({ type: "string", columnName: "LastName" })
    public LastName: string;

    @Column({ type: "string", columnName: "Email" })
    public Email: string;

    @Column({ type: "string", columnName: "PhoneNumber" })
    public PhoneNumber: string;

    @Column({ type: "string", columnName: "Password" })
    public Password: string;

    @Column({ type: "string", columnName: "Login" })
    public Login: string;

    @Column({ type: "number", columnName: "AddressId" })
    public AddressId: number;

    constructor(jsonData: IDictionary<any>) {
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

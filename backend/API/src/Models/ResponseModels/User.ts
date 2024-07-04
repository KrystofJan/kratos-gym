import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { Address } from './Address.js';
import { Model } from '../Model.js';
import { PrimaryIdentifier, ForeignIdentifier } from '../Decorators/IdentifierDecorator.js';

export enum UserRole {
    CUSTOMER = 'c',
    TRAINER = 'T',
    EMPLOYEE = 'E',
    USER = 'U',
    NOTKNOWN = '/',
}

export enum UserAttrs {
    UserId = 'UserId',
    FirstName = 'FirstName',
    LastName = 'LastName',
    Role = 'Role',
    Email = 'Email',
    PhoneNumber = 'PhoneNumber',
    IsActive = 'IsActive',
    CreateDate = 'CreateDate',
    LastOnline = 'LastOnline',
    Password = 'Password',
    Address = 'Address',
    Credits = 'Credits',
    Login = 'Login',
}

@Table("")
export class User extends Model {

    @PrimaryIdentifier()
    @Column({ type: "number", columnName: "UserId" })
    public UserId: number;

    @Column({ type: "string", columnName: "FirstName" })
    public FirstName: string;

    @Column({ type: "string", columnName: "LastName" })
    public LastName: string;

    @Column({ type: "UserRole", columnName: "Role" })
    public Role: UserRole;

    @Column({ type: "string", columnName: "Email" })
    public Email: string;

    @Column({ type: "string", columnName: "PhoneNumber" })
    public PhoneNumber: string;

    @Column({ type: "boolean", columnName: "IsActive" })
    public IsActive: boolean;

    @Column({ type: "date", columnName: "CreateDate" })
    public CreateDate: Date;

    @Column({ type: "date", columnName: "LastOnline" })
    public LastOnline: Date;

    @Column({ type: "string", columnName: "Password" })
    public Password: string;

    @ForeignIdentifier("AddressId")
    @Column({ type: "foreignObject", columnName: "Address" })
    public Address: Address | null;

    @Column({ type: "number", columnName: "Credits" })
    public Credits: number;

    @Column({ type: "string", columnName: "Login" })
    public Login: string;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.UserId = jsonData.UserId;
        this.FirstName = jsonData.FirstName;
        this.LastName = jsonData.LastName;
        this.Role = UserRole.CUSTOMER;
        switch (jsonData.Role) {
            case UserRole.CUSTOMER: {
                this.Role = UserRole.CUSTOMER;
                break;
            }
            case UserRole.TRAINER: {
                this.Role = UserRole.TRAINER;
                break;
            }
            case UserRole.EMPLOYEE: {
                this.Role = UserRole.EMPLOYEE;
                break;
            }
            case UserRole.USER: {
                this.Role = UserRole.USER;
                break;
            }
            // default: {
            //     throw new Error(`Unknown user role ${jsonData.Role}`);
            // }
        }

        this.Email = jsonData.Email;
        this.PhoneNumber = jsonData.PhoneNumber;
        this.IsActive = (jsonData.IsActive) ? jsonData.IsActive : true;
        this.CreateDate = (jsonData.CreateDate) ? jsonData.CreateDate : '';
        this.LastOnline = (jsonData.LastOnline) ? jsonData.LastOnline : '';
        this.Password = jsonData.Password;
        this.Address = jsonData.Address ?? null;
        this.Credits = jsonData.credits ?? 0;
        this.Login = jsonData.login;
    }
}

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

export class User extends Model {

    @PrimaryIdentifier()
    public UserId: number;
    public FirstName: string;
    public LastName: string;
    public Role: UserRole;
    public Email: string;
    public PhoneNumber: string;
    public IsActive: Boolean;
    public CreateDate: Date;
    public LastOnline: Date;
    public Password: string;
    @ForeignIdentifier("AddressId")
    public Address: Address | null;
    public Credits: number;
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

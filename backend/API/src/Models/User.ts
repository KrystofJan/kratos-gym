import { IDictionary } from '../utils/Utilities.js';
import { Address } from './Address.js';
import { Model } from './Model.js';

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

export class Account extends Model {
    public AccountId: number;
    public FirstName: string;
    public LastName: string;
    public Role: UserRole;
    public Email: string;
    public PhoneNumber: string;
    public IsActive: Boolean;
    public CreateDate: Date;
    public LastOnline: Date;
    public Password: string;
    public Address: Address | null;
    public Credits: number;
    public Login: string;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.AccountId = jsonData.account_id;
        this.FirstName = jsonData.first_name;
        this.LastName = jsonData.last_name
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

        this.Email = jsonData.email;
        this.PhoneNumber = jsonData.phone_number;
        this.IsActive = (jsonData.isactive) ? jsonData.isactive : true;
        this.CreateDate = (jsonData.create_date) ? jsonData.create_date : '';
        this.LastOnline = (jsonData.last_online) ? jsonData.last_online : '';
        this.Password = jsonData.password;
        this.Address = jsonData.address ?? null;
        this.Credits = jsonData.credits ?? 0;
        this.Login = jsonData.login;
    }
}

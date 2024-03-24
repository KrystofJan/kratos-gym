import { IDictionary } from '../utils/Utilities.js';
import { Address } from './Address.js';
import { Model } from './Model.js';

export enum UserRole{
    CUSTOMER = 'c',
    TRAINER = 'T',
    EMPLOYEE = 'E',   
    USER = 'U',   
    NOTKNOWN = '/',
}

export class User extends Model{
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
    public Address: Address | null;
    public Credits: number;

    constructor(jsonData: IDictionary<any>){
        super();
        this.UserId = jsonData.UserId;
        this.FirstName = jsonData.FirstName;
        this.LastName = jsonData.LastName;
        this.Role = UserRole.CUSTOMER;
        switch(jsonData.Role) {
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
    }    
}

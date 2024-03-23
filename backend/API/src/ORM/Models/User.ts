import { IDictionary } from '../../utils/Utilities.js';
import { Address } from './Address.js';
import { Model } from './Model.js';

export enum UserRole{
    CUSTOMER = 'c',
    TRAINER = 't',
    EMPLOYEE = 'e'    
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
    public Address: Address;
    public Credits: number;


    constructor(jsonData: IDictionary<any>){
        super();
        this.UserId = jsonData.UserId;
        this.FirstName = jsonData.FirstName;
        this.LastName = jsonData.LastName;

        switch(jsonData.Role) {
            case 'c': {
                this.Role = UserRole.CUSTOMER;
                break;
            }
            case 't': {
                this.Role = UserRole.TRAINER;
                break;
            }
            case 'e': {
                this.Role = UserRole.EMPLOYEE;
                break;
            }
            default: {
                throw new Error("Unknown user role");
            }
        }

        this.Email = jsonData.Email;
        this.PhoneNumber = jsonData.PhoneNumber;
        this.IsActive = (jsonData.IsActive) ? jsonData.IsActive : true;
        this.CreateDate = (jsonData.CreateDate) ? jsonData.CreateDate : '';
        this.LastOnline = (jsonData.LastOnline) ? jsonData.LastOnline : '';
        this.Password = jsonData.Password;
        this.Address = jsonData.Address;
        this.Credits = jsonData.credits ?? 0;
    }    
}
module.exports = User;
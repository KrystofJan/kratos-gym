import { IDictionary } from '../../utils';
import { Address } from '../address/address.model';
import { Model } from '../Model';
import { Column, ForeignKey, PrimaryKey, Table } from "../../database";
import { UnInsertable } from '../../database/decorators/database-decorators';

export enum UserRole {
    CUSTOMER = 'c',
    TRAINER = 'T',
    EMPLOYEE = 'E',
    USER = 'U',
    NOTKNOWN = '/',
}

@Table("account")
@PrimaryKey("account_id")
export class Account extends Model {

    @Column("account_id")
    public AccountId: number;

    @Column("first_name")
    public FirstName: string;

    @Column("last_name")
    public LastName: string;

    @Column("role")
    public Role: UserRole | undefined;

    @Column("email")
    public Email: string;

    @Column("phone_number")
    public PhoneNumber: string;

    @Column("is_active")
    public IsActive: boolean;

    @Column("create_date")
    public CreateDate: Date;

    @Column("last_online")
    public LastOnline: Date;

    @Column("password")
    public Password: string;

    @ForeignKey(Address)
    @Column("address_id")
    public Address: Address | undefined;

    @Column("credits")
    public Credits: number;

    @Column("login")
    public Login: string;

    @UnInsertable()
    @Column("clerk_id")
    public ClerkId?: string;


    @Column("profile_picture_url")
    public ProfilePictureUrl?: string;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.AccountId = jsonData["account_id"] ?? jsonData["AccountId"];
        this.FirstName = jsonData["first_name"] ?? jsonData["FirstName"];
        this.LastName = jsonData["last_name"] ?? jsonData["LastName"]
        const role = jsonData["role"] ?? jsonData["Role"]
        switch (role) {
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
            default: {
                this.Role = undefined
            }
        }

        this.Email = jsonData["email"] ?? jsonData["Email"];
        this.PhoneNumber = jsonData["phone_number"] ?? jsonData["PhoneNumber"];
        const isActive = jsonData["is_active"] ?? jsonData["isActive"]
        this.IsActive = (isActive);
        this.CreateDate = jsonData["create_date"] ?? jsonData["CreateDate"];
        this.LastOnline = jsonData["last_online"] ?? jsonData["LastOnline"];
        this.Password = jsonData["password"] ?? jsonData["Password"];
        this.Credits = jsonData["credits"] ?? jsonData["Credits"];
        this.Login = jsonData["login"] ?? jsonData["Login"];
        if (jsonData["address"]) {
            this.Address = jsonData["address"]
        } else {
            this.Address = new Address(jsonData)
            if (!this.Address.AddressId) {
                this.Address = undefined
            }
        }
        this.ClerkId = jsonData["clerk_id"] ?? jsonData["ClerkId"];
        this.ProfilePictureUrl = jsonData["profile_picture_url"] ?? jsonData["ProfilePictureUrl"];
    }
}

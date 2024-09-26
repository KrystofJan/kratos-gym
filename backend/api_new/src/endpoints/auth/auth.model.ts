import { Column, PrimaryKey, Table } from "../../database";
import { DatabaseType, IDictionary } from "../../utils/utilities";
import { Model } from "../Model";

@Table("account")
@PrimaryKey("account_id")
export class Auth extends Model {
    @Column("account_id")
    AccountId: Number | null;

    @Column("clerk_id")
    ClerkId: string;

    @Column("email")
    Email: string;

    @Column("first_name")
    FirstName: string;

    @Column("last_name")
    LastName: string;

    @Column("phone_number")
    PhoneNumber: string | null;

    @Column("login")
    Login: string;

    constructor(data: IDictionary<any>) {
        super()
        this.ClerkId = data["ClerkId"];
        this.Email = data["Email"];
        this.FirstName = data["FirstName"];
        this.LastName = data["LastName"];
        this.Login = data["Login"];
        this.PhoneNumber = data["PhoneNumber"];
        this.AccountId = data["account_id"];
    }
}


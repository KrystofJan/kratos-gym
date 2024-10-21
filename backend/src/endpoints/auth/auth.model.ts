import { Column, PrimaryKey, Table } from "../../database";
import { IDictionary } from "../../utils/utilities";
import { Model } from "../Model";

@Table("account")
@PrimaryKey("account_id")
export class Auth extends Model {
    @Column("clerk_id")
    ClerkId: string;

    @Column("email")
    Email: string;

    @Column("first_name")
    FirstName: string;

    @Column("last_name")
    LastName: string;

    @Column("login")
    Login: string;

    @Column("profile_picture_url")
    public ProfilePictureUrl?: string;

    constructor(data: IDictionary<any>) {
        super()
        this.ClerkId = data["ClerkId"];
        this.Email = data["Email"];
        this.FirstName = data["FirstName"];
        this.LastName = data["LastName"];
        this.Login = data["Login"];
        this.ProfilePictureUrl = data["profile_picture_url"] ?? data["ProfilePictureUrl"];
    }
}


import { Column, PrimaryKey, Table } from '../../database'
import { IDictionary } from '../../utils/utilities'
import { Model } from '../base'

@Table('account')
@PrimaryKey('account_id')
export class Auth extends Model {
    @Column('clerk_id')
    ClerkId: string

    @Column('email')
    Email: string

    @Column('first_name')
    FirstName: string

    @Column('last_name')
    LastName: string

    @Column('login')
    Login: string

    @Column('profile_picture_url')
    public ProfilePictureUrl: string | null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(data: IDictionary<any>) {
        super()
        this.ClerkId = data['ClerkId']
        this.Email = data['Email']
        this.FirstName = data['FirstName']
        this.LastName = data['LastName']
        this.Login = data['Login']
        if (
            data['profile_picture_url'] ??
            data['ProfilePictureUrl'] === undefined
        ) {
            this.ProfilePictureUrl = null
        } else {
            this.ProfilePictureUrl =
                data['profile_picture_url'] ?? data['ProfilePictureUrl']
        }
    }
}

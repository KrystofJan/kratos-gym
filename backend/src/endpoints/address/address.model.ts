import { IDictionary } from '../../utils'
import { Model } from '../base'
import { Column, PrimaryKey, Table } from '../../database'

@Table('address')
@PrimaryKey('address_id')
export class Address extends Model {
    @Column('address_id')
    public AddressId?: number

    @Column('street')
    public Street: string

    @Column('city')
    public City: string

    @Column('postal_code')
    public PostalCode: string

    @Column('country')
    public Country: string

    @Column('building_number')
    public BuildingNumber: string

    @Column('apartment_number')
    public ApartmentNumber: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(jsonData: IDictionary<any>) {
        super()
        const addrId = jsonData['address_id'] ?? jsonData['AddressId']
        if (addrId) {
            this.AddressId = addrId
        }
        this.Street = jsonData['street'] ?? jsonData['Street']
        this.City = jsonData['city'] ?? jsonData['City']
        this.PostalCode = jsonData['postal_code'] ?? jsonData['PostalCode']
        this.Country = jsonData['country'] ?? jsonData['Country']
        this.BuildingNumber =
            jsonData['building_number'] ?? jsonData['BuildingNumber']
        this.ApartmentNumber =
            jsonData['apartment_number'] ?? jsonData['ApartmentNumber']
    }
}

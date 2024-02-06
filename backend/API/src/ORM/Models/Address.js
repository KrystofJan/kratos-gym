class Address{

    constructor(jsonData){
        this.addressId = jsonData.AddressId;
        this.street = jsonData.Street;
        this.city = jsonData.City;
        this.postalCode = jsonData.PostalCode;
        this.country = jsonData.Country;
        this.buildingNumber = jsonData.BuildingNumber;
        this.apartmentNumber = jsonData.ApartmentNumber;
    }

    constructJson(){
        return {
            "AddressId": this.addressId,
            "Street": this.street,
            "City": this.city,
            "postalCode": this.postalCode,
            "Country": this.country,
            "BuildingNumber": this.buildingNumber,
            "ApartmentNumber": this.apartmentNumber,
        }
    }
}

module.exports = Address;
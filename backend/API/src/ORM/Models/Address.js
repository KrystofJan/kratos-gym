class Address{

    
    constructFromJson(jsonData){
        this.addressId = jsonData.AddressId;
        this.street = jsonData.Street;
        this.city = jsonData.City;
        this.postalCode = jsonData.PostalCode;
        this.country = jsonData.Country;
        this.buildingNumber = jsonData.BuildingNumber;
        this.apartmentNumber = jsonData.ApartmentNumber;
    }
    
    constructFromData(street, city, postalCode, country, buildingNumber, apartmentNumber){
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
        this.buildingNumber = buildingNumber;
        this.apartmentNumber = apartmentNumber;
    }

    constructJson(jsonData){        
        this.constructFromJson(jsonData);
        return this;
    }
    
}
module.exports = Address;
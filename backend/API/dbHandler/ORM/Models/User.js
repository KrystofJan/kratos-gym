class User{
    constructor(){
    }

    constructFromJson(jsonData){
        this.street = jsonData.Street,
        this.city = jsonData.City,
        this.postalCode = jsonData.PostalCode,
        this.country = jsonData.Country,
        this.buildingNumber = jsonData.BuildingNumber,
        this.apartmentNumber = jsonData.ApartmentNumber
        console.log(this);
    }
    
    constructFromData(street, city, postalCode, country, buildingNumber, apartmentNumber){
        this.street = street;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
        this.buildingNumber = buildingNumber;
        this.apartmentNumber = apartmentNumber;
    }
}
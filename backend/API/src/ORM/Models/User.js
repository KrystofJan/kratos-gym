class User{

    constructFromJson(jsonData){
        this.userId = jsonData.UserId;
        this.firstName = jsonData.FirstName;
        this.lastName = jsonData.LastName;
        this.role = (jsonData.Role)? jsonData.Role : 'c';
        this.email = jsonData.Email;
        this.phoneNumber = jsonData.PhoneNumber;
        this.isActive = (jsonData.IsActive) ? jsonData.IsActive : true;
        this.createDate = (jsonData.CreateDate) ? jsonData.CreateDate : '';
        this.lastOnline = (jsonData.LastOnline) ? jsonData.LastOnline : '';
        this.password = jsonData.Password;
        this.address = jsonData.Address;
        this.credits = (jsonData.credits) ? jsonData.credits : 0;
    }
    
    constructFromData(street, city, postalCode, country, buildingNumber, apartmentNumber){
        this.userId = userId;
        this.firstName = firstName;
        // TODO: Finish

        // this.lastName = jsonData.LastName;
        // this.role = jsonData.Role;
        // this.email = jsonData.Email;
        // this.phoneNumber = jsonData.PhoneNumber;
        // this.isActive = jsonData.isActive;
        // this.createDate = jsonData.CreateDate;
        // this.lastOnline = jsonData.LastOnline;
        // this.password = jsonData.Password;
        // this.Address = jsonData.Address;
    }

    constructJson(addr){
        return{
            "UserId": this.userId,
            "FirstName": this.firstName,
            "LastName": this.lastName,
            "Role": this.role,
            "Email": this.email,
            "PhoneNumber": this.phoneNumber,
            "IsActive": this.isActive,
            "CreateDate": this.createDate,
            "LastOnline": this.lastOnline,
            "AddressId": (addr)? this.address:null,
            "credits": this.credits
        }
    }
    
}
module.exports = User;
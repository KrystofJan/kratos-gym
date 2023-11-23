const dbHandler = require('../../DatabaseHandler');
const NoTableExcp = require('../../../../Exceptions/NoTableSelectedError');

class RelationalModel{

    constructor(){
        this.dbHandler = new dbHandler();
     }

    constructFromJson(jsonData){
        throw new NoTableExcp(this);
    }
    
    constructFromData(street, city, postalCode, country, buildingNumber, apartmentNumber){
        throw new NoTableExcp(this);
    }
    
    getAll(res, req){
        throw new NoTableExcp(this);
    }
}
module.exports = RelationalModel;
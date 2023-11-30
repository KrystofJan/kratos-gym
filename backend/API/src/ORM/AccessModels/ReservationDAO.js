const RelationalModel = require('./RelationalModel');
const User = require('../Models/User');
const UserDAO = require('./UserDAO');

class ReservationDAO extends RelationalModel{

    async getId(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"Reservation"));
            return result[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async getAll(id){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectAll("Reservation"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = ReservationDAO;
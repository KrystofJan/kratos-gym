const RelationalModel = require('./RelationalModel');

class UserDAO extends RelationalModel{
    async getId(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"User"));

            return result[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = UserDAO;
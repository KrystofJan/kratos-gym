const RelationalModel = require('../Models/RelationalModel');

class UserDAO extends RelationalModel{
    async getId(res, id, connection){

        try{
            if (connection){

                this.dbHandler.dbConnect();
            }
            
            const body = await this.dbHandler.dbSelectSpecific(res, id,'User');
            
            if(connection){
                this.dbHandler.dbDisconnect();
            }
            return body[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = UserDAO;
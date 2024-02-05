const RelationalModel = require('./RelationalModel');

class AddressDAO extends RelationalModel{

    async getAll(){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectAll("Address"));
            return result;            
        }
        catch(err){        
            console.error(err);
        }
        
    }

    async get(id){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"Address"));
            return result[0];            
        }
        catch(err){        
            console.error(err);
        }
    }

    async post (body){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body, "Address"));
            return result;
        }        
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = AddressDAO;
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
}
module.exports = AddressDAO;
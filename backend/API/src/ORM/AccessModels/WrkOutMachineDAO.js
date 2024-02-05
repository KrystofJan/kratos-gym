const RelationalModel = require('./RelationalModel');

class WrkOutMachineDAO extends RelationalModel{

    async getAll(){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectAll("WrkOutMachine"));
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async getId(id){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id, "WrkOutMachine"));
            return result[0];
        }
        catch(err){        
            console.error(err);
        }
    }

    async post (body){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body, "WrkOutMachine"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async recommendMachine(id){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbRecommendMachine(id));
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }
}
module.exports = WrkOutMachineDAO;
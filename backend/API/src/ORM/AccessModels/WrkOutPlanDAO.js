const RelationalModel = require('./RelationalModel');

class WrkOutPlanDAO extends RelationalModel{

    async getId(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"WrkOutPlan"));
            return result[0];
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async getAll(){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectAll("WrkOutPlan"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = WrkOutPlanDAO;
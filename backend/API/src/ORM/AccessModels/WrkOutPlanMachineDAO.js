const RelationalModel = require('./RelationalModel');

class WrkOutPlanMachinesDAO extends RelationalModel{

    async getIdMachine(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"WrkOutPlanMachines--machine"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async getOccupiedMachineAmount(id, time, date) {
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectOccupiedMachineAmount(id, time, date));
            return result;
        }
        catch(err) {
            console.log("chibi", err);
        }
    }

    async getIdPlan(id){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id, "WrkOutPlanMachines--plan"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async post(body) {
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body,"WrkOutPlanMachines"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = WrkOutPlanMachinesDAO;
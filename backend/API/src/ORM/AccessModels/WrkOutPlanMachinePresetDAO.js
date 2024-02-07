const RelationalModel = require('./RelationalModel');

class WrkOutPlanMachinesPresetDAO extends RelationalModel{

    async getIdMachine(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"WrkOutPlanMachinesPreset--machine"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async getIdPreset(id){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id, "WrkOutPlanMachinesPreset--preset"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async post(body) {
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body,"WrkOutPlanMachinesPreset"));
            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = WrkOutPlanMachinesPresetDAO;

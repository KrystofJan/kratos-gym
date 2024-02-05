const RelationalModel = require('./RelationalModel');

class MachineExerciseTypesDAO extends RelationalModel{

    async getIdMachine(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"MachineExerciseTypes--machine"));

            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async getIdType(id){

        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"MachineExerciseTypes--type"));

            return result;
        }
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }

    async post (body){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body, "MachineExerciseTypes"));
            return result;
        }        
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}

module.exports = MachineExerciseTypesDAO;

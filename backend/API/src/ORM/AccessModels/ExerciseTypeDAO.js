const RelationalModel = require('./RelationalModel');

class ExerciseTypeDAO extends RelationalModel{

    async getAll(){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectAll("ExerciseType"));
            return result;            
        }
        catch(err){        
            console.error(err);
        }
        
    }

    async get(id){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbSelectSpecific(id,"ExerciseType"));
            return result[0];            
        }
        catch(err){        
            console.error(err);
        }
    }

    async post (body){
        try{
            const result = await this.MakeDbRequest(() => this.dbHandler.dbPost(body, "ExerciseType"));
            return result;
        }        
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}
module.exports = ExerciseTypeDAO;
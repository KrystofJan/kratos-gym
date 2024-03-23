import { IDictionary } from "../../utils/Utilities.js";
import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { ExerciseType } from '../Models/ExerciseType.js'
import { DatabaseFail, DatabaseResponse } from "../Database/DatabaseResponse.js";

export class ExerciseTypeDAO extends RelationalModel{

    async SelectAllExerciseTypes(){
        try{
            const result = await this.MakeDbRequest(
                () => this.dbHandler.dbSelectAll(TableTypes.ExerciseType)
            );
            return result.Body;            
        }
        catch(err){        
            console.error(err);
        }
        
    }

    async SelectExerciseTypeById(id: number){
        try{
            const result = await this.MakeDbRequest(
                () => this.dbHandler.dbSelectSpecific(id, TableTypes.ExerciseType)
            );
            return result.Body[0];            
        }
        catch(err){        
            console.error(err);
        }
    }

    async InsertExerciseType (body: ExerciseType){
        try{
            const result = await this.MakeDbRequest(
                () => this.dbHandler.dbPost(body, TableTypes.ExerciseType)
            );
            return result;
        }        
        catch(error){
            console.log("Nastala chyba: " + error);
        }
    }
}

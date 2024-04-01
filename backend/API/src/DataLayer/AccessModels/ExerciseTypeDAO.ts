import { IDictionary } from "../../utils/Utilities.js";
import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { ExerciseType } from '../../Models/ExerciseType.js'
import { DatabaseFail, DatabaseResponse } from "../Database/DatabaseResponse.js";

export class ExerciseTypeDAO extends RelationalModel{

    constructor() {
        super(TableTypes.ExerciseType);
    }

    async SelectAllExerciseTypes(){
        try{
            const result = this.SelectAll();
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async SelectExerciseTypeById(id: number){
        try{
            const result = this.SelectById(id);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async InsertExerciseType (body: ExerciseType){
        try{
            const result = this.Insert(body);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }
}

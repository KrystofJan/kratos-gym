import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { WrkOutPlanTypePostModel } from '../../Models/PostModels/WrkOutPlanTypePostModel.js';

export class WrkOutPlanType extends RelationalModel{

    constructor() {
        super(TableTypes.WrkOutPlanType);
    }

    // TODO: Move logic to wrkOutPlan
    async SelectWrkOutPlanTypeBy_WrkOutPlanId(id: number){
        try{
            const result = this.SecectByForeignId(id, TableTypes.WrkOutPlan);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    // TODO: Move logic to wrkOutMachine
    async SelectWrkOutPlanTypeBy_ExerciseType(id: number){
        try{
            const result = this.SecectByForeignId(id, TableTypes.ExerciseType);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async InsertWrkOutPlanType(body: WrkOutPlanTypePostModel){
        try{
            const result = this.Insert(body);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }
}

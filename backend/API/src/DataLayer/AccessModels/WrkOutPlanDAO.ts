
import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { WrkOutPlanPostModel } from '../../Models/PostModels/WrkOutPlanPostModel.js';

export class WrkOutPlanDAO extends RelationalModel{

    constructor() {
        super(TableTypes.WrkOutPlan);
    }

    async SelectWrkOutPlanById(id: number){
        try{
            const result = this.SelectById(id);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async SelectAllWrkOutPlans(){
        try{
            const result = this.SelectAll();
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }

    async InsertWrkOutPlan(body: WrkOutPlanPostModel){
        try{
            const result = this.Insert(body);
            return result;
        }
        catch(err){        
            console.error(err);
        }
    }
}

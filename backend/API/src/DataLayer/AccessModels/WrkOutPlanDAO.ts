
import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { WrkOutPlanPostModel } from '../../Models/PostModels/WrkOutPlanPostModel.js';
import { DatabaseFail } from '../Database/DatabaseResponse.js';

export class WrkOutPlanDAO extends RelationalModel {

    constructor() {
        super(TableTypes.WrkOutPlan);
    }

    async SelectWrkOutPlanById(id: number) {
        try {
            const result = await this.SelectById(id);
            console.log(result)
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectAllWrkOutPlans() {
        try {
            const result = await this.SelectAll();
            console.log(result)
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async InsertWrkOutPlan(body: WrkOutPlanPostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            console.error(err);
            return new DatabaseFail(err as Error)
        }
    }
}

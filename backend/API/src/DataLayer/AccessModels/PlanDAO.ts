
import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { PlanPostModel } from '../../Models/PostModels/PlanPostModel.js';
import { DatabaseFail } from '../Database/DatabaseResponse.js';

export class PlanDAO extends RelationalModel {

    constructor() {
        super(TableTypes.Plan);
    }

    async SelectPlanById(id: number) {
        try {
            const result = await this.SelectById(id);
            console.log(result)
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectAllPlans() {
        try {
            const result = await this.SelectAll();
            console.log(result)
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async InsertPlan(body: PlanPostModel) {
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


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
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectAllPlans() {
        try {
            const result = await this.SelectAll();
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertPlan(body: PlanPostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

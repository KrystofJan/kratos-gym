
import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { PlanPostModel } from '../../Models/PostModels/PlanPostModel.js';
import { DatabaseFail } from '../Database/DatabaseResponse.js';
import { Plan } from '../../Models/Plan.js';

export class PlanDAO extends RelationalModel {

    constructor() {
        super(TableTypes.Plan);
    }

    async SelectPlanById(id: number) {
        try {
            const result = await this.dbHandler.SelectSpecific<Plan>(Plan, id);
            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectAllPlans() {
        try {
            const result = await this.dbHandler.SelectAll<Plan>(Plan);
            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertPlan(body: Plan) {
        try {
            const result = await this.dbHandler.Insert(Plan, body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

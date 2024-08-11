import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { PlanTypePostModel } from '../../Models/PostModels/PlanTypePostModel.js';

export class PlanTypeDAO extends RelationalModel {

    constructor() {
        super(TableTypes.PlanType);
    }

    // TODO: Move logic to wrkOutPlan
    async SelectPlanTypeBy_PlanId(id: number) {
        try {
            const result = this.SecectByForeignId(id, TableTypes.Plan)
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    // TODO: Move logic to wrkOutMachine
    async SelectPlanTypeBy_ExerciseType(id: number) {
        try {
            const result = this.SecectByForeignId(id, TableTypes.ExerciseType);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async Insertpe(body: PlanTypePostModel) {
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


import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { Plan } from '../../Models/Plan.js';
import { DatabaseFail } from '../Database/DatabaseResponse.js';
import { PlanPreset } from '../../Models/PlanPreset.js';

export class PlanPresetDAO extends RelationalModel {
    // Move to Plan 

    constructor() {
        super(TableTypes.PlanPreset);
    }

    async SelectPlanPresetById(id: number) {
        try {
            const result = await this.dbHandler.SelectSpecific<PlanPreset>(PlanPreset, id)
            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectAllPlanPresets() {
        try {
            const result = await this.dbHandler.SelectAll<PlanPreset>(PlanPreset)

            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertPlanPreset(body: Plan) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

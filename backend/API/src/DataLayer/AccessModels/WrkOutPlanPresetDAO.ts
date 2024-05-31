
import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { WrkOutPlan } from '../../Models/ResponseModels/WrkOutPlan.js';

export class WrkOutPlanPresetDAO extends RelationalModel {
    // Move to WrkOutPlan 

    constructor() {
        super(TableTypes.WrkOutPlanPreset);
    }

    async SelectWrkOutPlanPresetById(id: number) {
        try {
            const result = this.SelectById(id);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectAllWrkOutPlanPresets() {
        try {
            const result = this.SelectAll();
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async InsertWrkOutPlanPreset(body: WrkOutPlan) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }
}

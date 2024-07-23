import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { WrkOutPlanMachinePostModel } from '../../Models/PostModels/WrkOutPlanMachinePostModel.js';

export class WrkOutPlanMachinesDAO extends RelationalModel {

    constructor() {
        super(TableTypes.test);
    }

    // TODO: Move logic to wrkOutPlan
    async SelectWrkOutPlanBy_WrkOutPlanId(id: number) {
        try {
            const result = this.SecectByForeignId(id, TableTypes.WrkOutPlan);
        }
        catch (err) {
            console.error(err);
        }
    }

    // TODO: Move logic to wrkOutMachine
    async SelectWrkOutPlanBy_WrkOutMachineId(id: number) {
        try {
            const result = this.SelectAll();
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectOccupiedMachineAmount(id: number, time: string, date: string) {

        try {
            const result: DatabaseResponse = await this.dbHandler.dbSelectOccupiedMachineAmount(id, time, date)

            if (result instanceof DatabaseSuccess) {
                const successResult = result as DatabaseSuccess;
                return successResult.Body;
            }
        }
        catch (err) {
            if (err instanceof DatabaseFail) {
                return err;
            }
            else {
                console.error(err);
                throw err;
            }
        }
    }

    async InsertWrkOutPlanMachine(body: WrkOutPlanMachinePostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }
}

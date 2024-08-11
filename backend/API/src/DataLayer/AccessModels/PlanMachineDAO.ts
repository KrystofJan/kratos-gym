import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { PlanMachinePostModel } from '../../Models/PostModels/PlanMachinePostModel.js';

export class PlanMachinesDAO extends RelationalModel {

    constructor() {
        super(TableTypes.PlanMachines);
    }

    // TODO: Move logic to wrkOutPlan
    async SelectPlanBy_PlanId(id: number) {
        try {
            const result = this.SecectByForeignId(id, TableTypes.Plan);
            return result;
        }
        catch (err) {
            console.error(err);
            throw err
        }
    }

    // TODO: Move logic to wrkOutMachine
    async SelectPlanBy_MachineId(id: number) {
        try {
            const result = this.SecectByForeignId(id, TableTypes.Machine);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectOccupiedMachineAmount(id: number, time: string, date: string) {

        try {
            const result: DatabaseResponse = await this.dbHandler.dbSelectOccupiedMachineAmount(id, time, date)
            console.log(result);
            if (result instanceof DatabaseSuccess) {
                const successResult = result as DatabaseSuccess;
                console.log(successResult.Body);
                return successResult.Body[0];
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

    async InsertPlanMachine(body: PlanMachinePostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            console.log("asdasd")
        }
    }
}

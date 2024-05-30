import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { WrkOutPlanMachinePostModel } from '../../Models/PostModels/WrkOutPlanMachinePostModel.js';
import { SimpleDatabaseRequest } from '../Database/DatabaseRequests/SingleDatabaseRequest.js';
export class WrkOutPlanMachinesDAO extends RelationalModel {

    constructor() {
        super(TableTypes.WrkOutPlanMachines);
    }

    // TODO: Move logic to wrkOutPlan
    async SelectWrkOutPlanBy_WrkOutPlanId(id: number) {
        try {
            const result = this.SecectByForeignId(id, TableTypes.WrkOutPlan);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    // TODO: Move logic to wrkOutMachine
    async SelectWrkOutPlanBy_WrkOutMachineId(id: number) {
        try {
            const result = this.SecectByForeignId(id, TableTypes.WrkOutMachine);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectOccupiedMachineAmount(id: number, time: string, date: string) {

        try {
            const simpleDatabaseRequest: SimpleDatabaseRequest = new SimpleDatabaseRequest(

                () => this.dbHandler.dbSelectOccupiedMachineAmount(id, time, date)
            )
            const result = await simpleDatabaseRequest.execute();
            if (result instanceof DatabaseSuccess) {
                const successResult = result as DatabaseSuccess;
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

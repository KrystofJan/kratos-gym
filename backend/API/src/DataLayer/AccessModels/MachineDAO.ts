import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { Machine } from '../../Models/Machine.js';
import { MachinePostModel } from "../../Models/PostModels/Machine.js";
import { DatabaseFail } from "../Database/DatabaseResponse.js";

export class MachineDAO extends RelationalModel {

    constructor() {
        super(TableTypes.Machine);
    }

    async SelectAllMachines() {
        try {
            const result = await this.dbHandler.SelectAll<Machine>(Machine)
            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectMachineById(id: number) {
        try {
            const result = await this.dbHandler.SelectSpecific<Machine>(Machine, id)

            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertMachine(body: MachinePostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async RecommendMachine(id: number) {
        try {
            const result = await this.dbHandler.dbRecommendMachine(id);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

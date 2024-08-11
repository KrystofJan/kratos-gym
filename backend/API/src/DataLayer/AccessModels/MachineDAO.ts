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
            const result = this.SelectAll();
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectMachineById(id: number) {
        try {
            const result = this.SelectById(id);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async InsertMachine(body: MachinePostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            console.error(err);
            return new DatabaseFail(err as Error)
        }
    }

    async RecommendMachine(id: number) {
        try {
            const result = await this.dbHandler.dbRecommendMachine(id);
            return result;
        }
        catch (err) {
            console.error(err);
            return new DatabaseFail(err as Error)
        }
    }
}

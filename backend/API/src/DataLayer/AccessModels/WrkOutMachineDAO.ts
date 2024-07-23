import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { WrkOutMachine } from '../../Models/WrkOutMachine.js';
import { WrkOutMachinePostModel } from "../../Models/PostModels/WrkOutMachine.js";
import { DatabaseFail } from "../Database/DatabaseResponse.js";

export class WrkOutMachineDAO extends RelationalModel {

    constructor() {
        super(TableTypes.WrkOutMachine);
    }

    async SelectAllWrkOutMachines() {
        try {
            const result = this.SelectAll();
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectWrkOutMachineById(id: number) {
        try {
            const result = this.SelectById(id);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async InsertWrkOutMachine(body: WrkOutMachinePostModel) {
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

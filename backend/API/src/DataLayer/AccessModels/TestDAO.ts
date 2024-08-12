import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { Model } from '../../Models/Model.js';
import { DatabaseFail } from '../Database/DatabaseResponse.js';

export class TestDAO extends RelationalModel {

    constructor() {
        super(TableTypes.test);
    }

    async getId(id: number) {
        try {
            const result = this.SelectById(id);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async getAll() {
        try {
            const result = this.SelectAll();
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async post(body: Model) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

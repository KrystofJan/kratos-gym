import { IDictionary } from "../../utils/Utilities.js";
import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { Address } from '../../Models/Address.js'
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from "../Database/DatabaseResponse.js";
import { AddressPostModel } from "../../Models/PostModels/AddressPostModel.js";
import { Database } from "../Database/Database.js";

export class AddressDAO extends RelationalModel {
    constructor() {
        super(TableTypes.Address);
    }

    async SelectAllAdresses() {
        try {
            const result = await this.SelectAll();
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectAdressById(id: number) {
        try {
            const result = await this.SelectById(id);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertAddress(body: AddressPostModel) {
        try {
            const result: DatabaseResponse = await this.Insert(body);
            return result as DatabaseSuccess;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

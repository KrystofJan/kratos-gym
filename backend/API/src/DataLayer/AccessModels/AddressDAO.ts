import { IDictionary } from "../../utils/Utilities.js";
import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { Address } from '../../Models/Address.js'
import { DatabaseFail, DatabaseResponse } from "../Database/DatabaseResponse.js";

export class AddressDAO extends RelationalModel {
    constructor() {
        super(TableTypes.Address);
    }

    async SelectAllAdresses() {
        try {
            const result = this.SelectAll();
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async SelectAdressById(id: number) {
        try {
            const result = this.SelectById(id);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async InsertAddress(body: Address) {
        try {
            const result = await this.Insert(body);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }
}

import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { Account } from '../../Models/Account.js'
import { UserRegPostModel } from '../../Models/PostModels/UserRegPostModel.js';
import { Database } from "../Database/Database.js";
import { DatabaseFail } from "../Database/DatabaseResponse.js";

export class AccountDAO extends RelationalModel {

    constructor() {
        super(TableTypes.Account);
    }


    async SelectUserById(id: number) {
        try {
            const result = await this.dbHandler.SelectSpecific(Account, id)
            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }


    async SelectUserByAttribute(attrName: string, attrValue: any) {
        try {
            const result = this.SelectByAttr(attrName, attrValue);
            return result;
        }
        catch (error) {
        }
    }

    async InsertUser(body: Account) {
        try {
            const result = await this.dbHandler.Insert(Account, body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

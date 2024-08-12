import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { Account } from '../../Models/User.js'
import { UserRegPostModel } from '../../Models/PostModels/UserRegPostModel.js';
import { Database } from "../Database/Database.js";
import { DatabaseFail } from "../Database/DatabaseResponse.js";

export class AccountDAO extends RelationalModel {

    constructor() {
        super(TableTypes.Account);
    }

    async SelectAllUsers() {
        try {
            const result = this.SelectAll();
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectUserById(id: number) {
        try {
            const result = await this.SelectById(id);
            return result;
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

    async InsertUser(body: UserRegPostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

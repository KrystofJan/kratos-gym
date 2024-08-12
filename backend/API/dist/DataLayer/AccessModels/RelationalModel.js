var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Database } from '../Database/Database.js';
import { DatabaseFail, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { Model } from '../../Models/Model.js';
export class RelationalModel {
    constructor(tableType) {
        this.dbHandler = new Database();
        this.TableType = tableType;
    }
    SecectByForeignId(id, foreignTableType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectSpecific(Model, id);
                if (result instanceof DatabaseSuccess) {
                    const successResult = result;
                    return successResult.Body;
                }
                else {
                    throw result;
                }
            }
            catch (err) {
                if (err instanceof DatabaseFail) {
                    return err;
                }
                else {
                    throw new DatabaseFail(err);
                    throw err;
                }
            }
        });
    }
    SelectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectAll(Model);
                if (result instanceof DatabaseSuccess) {
                    const successResult = result;
                    return successResult.Body;
                }
            }
            catch (err) {
                if (err instanceof DatabaseFail) {
                    return err;
                }
                else {
                    throw new DatabaseFail(err);
                    throw err;
                }
            }
        });
    }
    SelectById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectSpecific(Model, id);
                if (result instanceof DatabaseSuccess) {
                    const successResult = result;
                    return successResult.Body;
                }
            }
            catch (err) {
                if (err instanceof DatabaseFail) {
                    return err;
                }
                else {
                    throw new DatabaseFail(err);
                    throw err;
                }
            }
        });
    }
    SelectByAttr(attrName, attrValue) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectAttrIs(attrValue, attrName, this.TableType);
                if (result instanceof DatabaseSuccess) {
                    const successResult = result;
                    return successResult.Body;
                }
            }
            catch (err) {
                if (err instanceof DatabaseFail) {
                    return err;
                }
                else {
                    throw new DatabaseFail(err);
                    throw err;
                }
            }
        });
    }
    Insert(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = new DatabaseSuccess({ "asd": "asdasd" }); // this.dbHandler.Insert<Model>(Model, body)
                return result;
            }
            catch (err) {
                if (err instanceof DatabaseFail) {
                    return err;
                }
                else {
                    throw new DatabaseFail(err);
                    throw err;
                }
            }
        });
    }
}

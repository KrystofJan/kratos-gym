var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { DatabaseFail } from '../Database/DatabaseResponse.js';
export class TestDAO extends RelationalModel {
    constructor() {
        super(TableTypes.test);
    }
    getId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.SelectById(id);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.SelectAll();
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    post(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.Insert(body);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
}

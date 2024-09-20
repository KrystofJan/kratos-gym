var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { Machine } from '../../Models/Machine.js';
import { DatabaseFail } from "../Database/DatabaseResponse.js";
export class MachineDAO extends RelationalModel {
    constructor() {
        super(TableTypes.Machine);
    }
    SelectAllMachines() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectAll(Machine);
                return result.Body;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    SelectMachineById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectSpecific(Machine, id);
                return result.Body;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    InsertMachine(body) {
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
    RecommendMachine(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.dbRecommendMachine(id);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
}

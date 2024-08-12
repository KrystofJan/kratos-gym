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
import { Plan } from '../../Models/Plan.js';
export class PlanDAO extends RelationalModel {
    constructor() {
        super(TableTypes.Plan);
    }
    SelectPlanById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectSpecific(Plan, id);
                return result.Body;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    SelectAllPlans() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.SelectAll(Plan);
                return result.Body;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    InsertPlan(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.dbHandler.Insert(Plan, body);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
}

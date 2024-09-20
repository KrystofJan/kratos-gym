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
export class PlanTypeDAO extends RelationalModel {
    constructor() {
        super(TableTypes.PlanType);
    }
    // TODO: Move logic to wrkOutPlan
    SelectPlanTypeBy_PlanId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.SecectByForeignId(id, TableTypes.Plan);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    // TODO: Move logic to wrkOutMachine
    SelectPlanTypeBy_ExerciseType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.SecectByForeignId(id, TableTypes.ExerciseType);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    Insertpe(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = this.Insert(body);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
                return new DatabaseFail(err);
            }
        });
    }
}

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
export class MachineExerciseTypesDAO extends RelationalModel {
    constructor() {
        super(TableTypes.MachineExerciseTypes);
    }
    // TODO: Move logic to wrkOutPlan
    SelectMachineExerciseTypesBy_ExerciseTypeId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SecectByForeignId(id, TableTypes.ExerciseType);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    // TODO: Move logic to wrkOutMachine
    SelectMachineExerciseTypesBy_MachineId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SecectByForeignId(id, TableTypes.Machine);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
            }
        });
    }
    InsertMachineExerciseTypes(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.Insert(body);
                return result;
            }
            catch (err) {
                throw new DatabaseFail(err);
                throw new DatabaseFail(err);
            }
        });
    }
}

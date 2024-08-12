import { RelationalModel } from './RelationalModel.js';
import { TableTypes } from "../Database/TableTypes.js";
import { DatabaseFail, DatabaseResponse, DatabaseSuccess } from '../Database/DatabaseResponse.js';
import { MachineExerciseTypePostModel } from '../../Models/PostModels/MachineExerciseTypePostModel.js';
import { Database } from '../Database/Database.js';

export class MachineExerciseTypesDAO extends RelationalModel {

    constructor() {
        super(TableTypes.MachineExerciseTypes);
    }

    // TODO: Move logic to wrkOutPlan
    async SelectMachineExerciseTypesBy_ExerciseTypeId(id: number) {
        try {
            const result = await this.SecectByForeignId(id, TableTypes.ExerciseType);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    // TODO: Move logic to wrkOutMachine
    async SelectMachineExerciseTypesBy_MachineId(id: number) {
        try {
            const result = await this.SecectByForeignId(id, TableTypes.Machine);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertMachineExerciseTypes(body: MachineExerciseTypePostModel) {
        try {
            const result = await this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
            throw new DatabaseFail(err as Error)
        }
    }
}

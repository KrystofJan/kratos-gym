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
            console.error(err);
        }
    }

    // TODO: Move logic to wrkOutMachine
    async SelectMachineExerciseTypesBy_WrkOutMachineId(id: number) {
        try {
            const result = await this.SecectByForeignId(id, TableTypes.WrkOutMachine);
            console.log('res', result);
            return result;
        }
        catch (err) {
            console.error(err);
        }
    }

    async InsertMachineExerciseTypes(body: MachineExerciseTypePostModel) {
        try {
            const result = await this.Insert(body);
            return result;
        }
        catch (err) {
            console.error(err);
            return new DatabaseFail(err as Error)
        }
    }
}

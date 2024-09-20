import { IDictionary } from "../../utils/Utilities.js";
import { RelationalModel } from "./RelationalModel.js";
import { TableTypes } from "../Database/TableTypes.js";
import { ExerciseType } from '../../Models/ExerciseType.js'
import { DatabaseFail, DatabaseResponse } from "../Database/DatabaseResponse.js";

export class ExerciseTypeDAO extends RelationalModel {

    constructor() {
        super(TableTypes.ExerciseType);
    }

    async SelectAllExerciseTypes() {
        try {
            const result = await this.dbHandler.SelectAll<ExerciseType>(ExerciseType)

            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectExerciseTypeById(id: number) {
        try {
            const result = await this.dbHandler.SelectSpecific<ExerciseType>(ExerciseType, id)

            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertExerciseType(body: ExerciseType) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

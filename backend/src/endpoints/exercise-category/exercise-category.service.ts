import { BasicQueryDatabase } from "../../database"
import { logger } from "../../utils"
import { ExerciseCategory } from "."
import { CodedError, ErrorCode } from "../../errors/base.error"
import { safeAwait } from "../../utils/utilities"

export class ExerciseCategoryService {

    static async GetAllExerciseCategories(): Promise<Array<ExerciseCategory>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(ExerciseCategory));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: ExerciseCategory) => new ExerciseCategory(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAccount failed")
        }
    }

    static async GetExerciseCategoryById(id: number): Promise<ExerciseCategory> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectSpecific(ExerciseCategory, id));
        if (databaseErr !== null) {
            throw databaseErr;
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Account with an id: '${id}' was not found`)
        }

        const model = new ExerciseCategory(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAccountById failed")
            throw err;
        }
        return model;
    }

    static async CreateExerciseCategory(body: ExerciseCategory): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(ExerciseCategory, body));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        const model = new ExerciseCategory(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreateExerciseCategory failed")
            throw err;
        }

        return Number(model.CategoryId);
    }

    static async UpdateExerciseCategoryById(id: number, body: Partial<ExerciseCategory>): Promise<ExerciseCategory> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Update(ExerciseCategory, id, body));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `ExerciseCategory with an id: '${id}' was not Deleted`)
        }

        const model = new ExerciseCategory(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetExerciseTyoeById failed")
            throw err;
        }

        return model;
    }

    static async DeleteExerciseCategoryById(id: number): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Delete(ExerciseCategory, id));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `ExerciseCategory with an id: '${id}' was not Deleted`)
        }

        return databaseResponse.Body;
    }

    static async GetCategorysByMachineId(id: number): Promise<ExerciseCategory[]> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectOnForeignTable(ExerciseCategory, "machine_exercise_type", "machine_id", id));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: ExerciseCategory) => new ExerciseCategory(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAccount failed")
        }
    }


    static async GetCategoriesByPlanId(id: number): Promise<ExerciseCategory[]> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectOnForeignTable(ExerciseCategory, "plan_category", "plan_id", id));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: ExerciseCategory) => new ExerciseCategory(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAccount failed")
        }
    }
}


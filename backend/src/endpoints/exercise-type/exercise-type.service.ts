import { BasicQueryDatabase } from '../../database'
import { logger } from '../../utils'
import { ExerciseType } from '.'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { safeAwait } from '../../utils/utilities'

export class ExerciseTypeService {
    static async GetAllExerciseTypes(
        limit?: number,
        page?: number
    ): Promise<Array<ExerciseType>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectAll(ExerciseType, limit, page)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        try {
            const models = databaseResponse.Body.map(
                (model: ExerciseType) => new ExerciseType(model)
            )
            return models
        } catch (err) {
            logger.error(err)
            throw new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAllAccount failed'
            )
        }
    }

    static async GetExerciseTypesById(id: number): Promise<ExerciseType> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectSpecific(ExerciseType, id)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(
                ErrorCode.NOT_FOUND_ERROR,
                `Account with an id: '${id}' was not found`
            )
        }

        const model = new ExerciseType(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAccountById failed'
            )
            throw err
        }
        return model
    }

    static async CreateExerciseType(body: ExerciseType): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.Insert(ExerciseType, body)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        const model = new ExerciseType(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at CreateExerciseType failed'
            )
            throw err
        }

        return Number(model.ExerciseTypeId)
    }

    static async UpdateExerciseTypeById(
        id: number,
        body: Partial<ExerciseType>
    ): Promise<ExerciseType> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.Update(ExerciseType, id, body)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(
                ErrorCode.NOT_FOUND_ERROR,
                `ExerciseType with an id: '${id}' was not Deleted`
            )
        }

        const model = new ExerciseType(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetExerciseTyoeById failed'
            )
            throw err
        }

        return model
    }

    static async DeleteExerciseTypeById(id: number): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.Delete(ExerciseType, id)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(
                ErrorCode.NOT_FOUND_ERROR,
                `ExerciseType with an id: '${id}' was not Deleted`
            )
        }

        return databaseResponse.Body
    }

    static async GetTypesByMachineId(id: number): Promise<ExerciseType[]> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectOnForeignTable(
                ExerciseType,
                'machine_exercise_type',
                'machine_id',
                id
            )
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        try {
            const models = databaseResponse.Body.map(
                (model: ExerciseType) => new ExerciseType(model)
            )
            return models
        } catch (err) {
            logger.error(err)
            throw new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAllAccount failed'
            )
        }
    }

    static async GetTypesByPlanId(id: number): Promise<ExerciseType[]> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectOnForeignTable(ExerciseType, 'plan_type', 'plan_id', id)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        try {
            const models = databaseResponse.Body.map(
                (model: ExerciseType) => new ExerciseType(model)
            )
            return models
        } catch (err) {
            logger.error(err)
            throw new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAllAccount failed'
            )
        }
    }
}

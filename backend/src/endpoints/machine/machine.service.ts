import { BasicQueryDatabase } from "../../database"
import { logger } from "../../utils"
import { Machine } from "."
import { safeAwait } from "../../utils/utilities"
import { CodedError, ErrorCode } from "../../errors/base.error"

export class MachineService {

    static async GetAllMachines(): Promise<Array<Machine>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(Machine));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: Machine) => new Machine(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllMachinees failed")
        }
    }

    static async GetMachineById(id: number): Promise<Machine> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectSpecific(Machine, id));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine with an id: '${id}' was not found`)
        }

        const model = new Machine(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetMachineById failed")
            logger.error(err)
            throw err;
        }
        return model;
    }

    static async UpdateMachineById(id: number, body: Partial<Machine>): Promise<Machine> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Update(Machine, id, body));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine with an id: '${id}' was not Deleted`)
        }

        const model = new Machine(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetMachineById failed")
            logger.error(err)
            throw err;
        }

        return model;
    }


    static async DeleteMachineById(id: number): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Delete(Machine, id));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine with an id: '${id}' was not Deleted`)
        }

        return databaseResponse.Body;
    }

    static async AddExerciseType(machineId: number, typeId: number): Promise<Machine> {
        const db = new BasicQueryDatabase()
        const [databaseErr, databaseResponse] = await safeAwait(db.InsertManyToMany(Machine, machineId, "machine_exercise_type", "exercise_type_id", typeId));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine with an id: '${typeId}' was not Added`)
        }

        return databaseResponse.Body;
    }

    static async CreateMachine(body: Machine): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(Machine, body));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        const model = new Machine(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreateMachine failed")
            logger.error(err)
            throw err;
        }

        return Number(model.MachineId);
    }
}


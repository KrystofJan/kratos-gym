import { BasicQueryDatabase, DatabaseFoundMultiple } from "../../database"
import { ExerciseType } from "../exercise-type"
import { Machine } from "../machine"
import { logger } from "../../utils"
import { Plan } from "."
import { safeAwait } from "../../utils/utilities"
import { CodedError, ErrorCode } from "../../errors/base.error"
import { MachinesInPlan } from "./machines-in-plan.model"

export class PlanService {

    static async GetAllPlanes(): Promise<Array<Plan>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(Plan));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: Plan) => new Plan(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllPlanes failed")
        }
    }

    static async GetPlanById(id: number): Promise<Plan> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectSpecific(Plan, id));
        if (databaseErr !== null) {
            throw databaseErr;
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Plan with an id: '${id}' was not found`)
        }

        const model = new Plan(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetPlanById failed")
            throw err;
        }
        return model;
    }

    static async UpdatePlanById(id: number, body: Partial<Plan>): Promise<Plan> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Update(Plan, id, body));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Plan with an id: '${id}' was not Deleted`)
        }

        const model = new Plan(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetPlanById failed")
            throw err;
        }

        return model;
    }


    static async DeletePlanById(id: number): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Delete(Plan, id));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Plan with an id: '${id}' was not Deleted`)
        }

        return databaseResponse.Body;
    }

    static async CreatePlan(body: Plan): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(Plan, body));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        const model = new Plan(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreatePlan failed")
            throw err;
        }

        return Number(model.PlanId);
    }

    static async GetMachinesByPlanId(id: number): Promise<Machine[]> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectOnForeignTable(Machine, "plan_machine", "plan_machine.plan_id", id));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: Machine) => new Machine(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAccount failed")
        }
    }

    static async GetMachinesInPlan(id: number): Promise<MachinesInPlan[]> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAttrIs(MachinesInPlan, id, "plan_id"))
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            return []
        }

        try {
            if (databaseResponse instanceof DatabaseFoundMultiple) {
                const models = databaseResponse.Body.map((model: MachinesInPlan) => new MachinesInPlan(model))
                return models;
            }
            return [new MachinesInPlan(databaseResponse.Body)];
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAccount failed")
        }
    }



    static async AddMachine(body: MachinesInPlan): Promise<MachinesInPlan> {
        const db = new BasicQueryDatabase()
        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(MachinesInPlan, body))
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine with an id: '${body.MachineId}' was not Added`)
        }

        const model = new MachinesInPlan(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreatePlan failed")
            throw err;
        }

        return databaseResponse.Body;
    }

    static async AddExerciseType(planId: number, typeId: number): Promise<Plan> {
        const db = new BasicQueryDatabase()
        const [databaseErr, databaseResponse] = await safeAwait(db.InsertManyToMany(Plan, planId, "plan_type", "exercise_type_id", typeId));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Plan with an id: '${typeId}' was not Added`)
        }

        return databaseResponse.Body;
    }

    static async GetTypesByPlanId(id: number): Promise<ExerciseType[]> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectOnForeignTable(ExerciseType, "plan_type", "plan_id", id));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: ExerciseType) => new ExerciseType(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAccount failed")
        }
    }

    static async DeleteMachineRecordFromPlan(machineId: number, planId: number) {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.DeleteManyToMany(Plan, planId, "plan_machine", "machine_id", machineId));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine ${machineId} was not deleted from plan '${planId}' `)
        }

        return databaseResponse.Body;
    }

    static async DeleteTypeRecordFromPlan(typeId: number, planId: number) {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.DeleteManyToMany(Plan, planId, "plan_type", "exercise_type_id", typeId));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Type ${typeId} was not deleted from plan '${planId}' `)
        }

        return databaseResponse.Body;
    }

    static async UpdateMachineInPlan(planId: number, machineId: number, body: Partial<MachinesInPlan>): Promise<MachinesInPlan> {
        const db = new BasicQueryDatabase()

        // TODO: figure this out... this does not work for some reason
        const [databaseErr, databaseResponse] = await safeAwait(db.Update(MachinesInPlan, planId, body, "machine_id", machineId));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Plan with an id: '${machineId}' was not Deleted`)
        }

        const model = new MachinesInPlan(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetPlanById failed")
            throw err;
        }

        return model;
    }
}


import { BasicQueryDatabase } from "../../database"
import { logger } from "../../utils"
import { Machine, MachineUsage, TimeRange, PlanRaw, PlanShort, Suggestion, SimplifiedMachineUsage } from "."
import { Time } from "@internationalized/date";
import { safeAwait } from "../../utils/utilities"
import { CodedError, ErrorCode } from "../../errors/base.error"
import { MachineDatabase } from "./machine.database"

export class MachineService {

    static async GetAllMachines(limit?: number, page?: number): Promise<Array<Machine>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(Machine, limit, page));
        if (databaseErr !== null) {
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


    static async GetRecommendedMachines(id: number): Promise<Array<Machine>> {
        const db = new MachineDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectMachinesWithinTheSameCategory(id));
        if (databaseErr !== null) {
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
            throw databaseErr;
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine with an id: '${id}' was not found`)
        }

        const model = new Machine(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetMachineById failed")
            throw err;
        }
        return model;
    }

    static async UpdateMachineById(id: number, body: Partial<Machine>): Promise<Machine> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Update(Machine, id, body));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Machine with an id: '${id}' was not Deleted`)
        }

        const model = new Machine(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetMachineById failed")
            throw err;
        }

        return model;
    }


    static async DeleteMachineById(id: number): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Delete(Machine, id));
        if (databaseErr !== null) {
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
            throw databaseErr;
        }

        const model = new Machine(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreateMachine failed")
            throw err;
        }

        return Number(model.MachineId);
    }

    static async GetMachineUsageByDate(id: number, date: Date, amount_of_people: number): Promise<Array<MachineUsage>> {
        const db = new MachineDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectMachineUsageByDate(id, date, amount_of_people));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: MachineUsage) => new MachineUsage(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllMachinees failed")
        }
    }



    static async SuggestTimes(machineUsage: MachineUsage[], desiredTimeRange: TimeRange, canDisturb: boolean): Promise<Suggestion> {
        const { StartTime, EndTime } = desiredTimeRange
        const desiredStartInt = StartTime.hour * 60 + StartTime.minute
        const desiredEndInt = EndTime.hour * 60 + EndTime.minute

        const findPlanFull = (id: PlanRaw): SimplifiedMachineUsage => {
            return {
                PlanId: id.PlanId,
                StartTime: id.StartTime.toString(),
                EndTime: id.EndTime.toString(),
                CanDisturb: id.CanDisturb,
                CanFit: id.CanFit,
                Next: findPlan(id.NextId),
                Prev: findPlan(id.PrevId),
            }
        }
        const findPlan = (id: number | null): PlanShort | null => {
            if (id === null) {
                return null
            }

            const result = machineUsage.filter(y => y.Plan.PlanId === id)

            if (result.length > 0) {
                const res = mapRes(result[0])
                return {
                    PlanId: res.PlanId,
                    StartTime: res.StartTime.toString(),
                    EndTime: res.EndTime.toString(),
                    CanFit: res.CanFit,
                    CanDisturb: res.CanDisturb,
                }
            }

            return null
        }

        const mapRes = (x: MachineUsage) => {

            let next: number | null = null
            if (x.NextPlan) {
                next = x.NextPlan.PlanId
            }

            let prev: number | null = null
            if (x.PreviousPlan) {
                prev = x.PreviousPlan.PlanId
            }
            const result: PlanRaw = {
                PlanId: x.Plan.PlanId,
                StartTime: x.StartTime,
                EndTime: x.EndTime,
                CanDisturb: x.CanDisturb,
                CanFit: x.CanFit,
                NextId: next,
                PrevId: prev
            }
            return result
        }

        const colidingPlan = machineUsage.map((x: MachineUsage) => {
            const result = mapRes(x)
            return findPlanFull(result)
        }).filter((time) => {
            const startTime = time.StartTime.split(':').map(x => Number(x))
            const endTime = time.EndTime.split(':').map(x => Number(x))
            const endInt = endTime[0] * 60 + endTime[1]
            const startInt = startTime[0] * 60 + startTime[1]
            const minEndTime = endInt <= desiredEndInt ? endInt : desiredEndInt
            const maxStartTime = startInt >= desiredStartInt ? startInt : desiredStartInt

            return maxStartTime <= minEndTime
        })

        const getTimeFromInt = (intTime: number) => {
            const timeHour = Math.floor(intTime / 60)
            const timeMinute = intTime % 60

            return new Time(timeHour, timeMinute)
        }

        const determineClosestTime = (
            item: SimplifiedMachineUsage,
            visited: Set<number> = new Set()
        ): Suggestion => {
            if (canDisturb && item.CanFit && item.CanDisturb) {
                return {
                    PrevSuggestion: desiredTimeRange,
                    NextSuggestion: desiredTimeRange
                }
            }
            const duration = desiredEndInt - desiredStartInt;

            const parseTimeToMinutes = (time: string): number => {
                const [hour, minute] = time.split(":").map(Number);
                return hour * 60 + minute;
            };

            const createSuggestion = (start: number, collides: boolean): TimeRange => ({
                StartTime: getTimeFromInt(start),
                EndTime: getTimeFromInt(start + duration),
                isColiding: collides
            });

            const startInt = parseTimeToMinutes(item.StartTime);
            const endInt = parseTimeToMinutes(item.EndTime);

            const prevEndInt = item.Prev ? parseTimeToMinutes(item.Prev.EndTime) : null;
            const nextStartInt = item.Next ? parseTimeToMinutes(item.Next.StartTime) : null;

            let prevSuggestion = null;
            let nextSuggestion = null;
            let realPrev: TimeRange = { StartTime: new Time(), EndTime: new Time(), isColiding: false };
            let next: TimeRange = { StartTime: new Time(), EndTime: new Time(), isColiding: false };

            // Previous suggestion
            if (prevEndInt === null || prevEndInt + duration <= startInt) {
                const startSuggest = startInt - duration;
                prevSuggestion = createSuggestion(startSuggest, false);
                realPrev = prevSuggestion;
            }

            // Next suggestion
            if (nextStartInt === null || nextStartInt - duration >= endInt) {
                const startSuggest = endInt;
                nextSuggestion = createSuggestion(startSuggest, false);
                next = nextSuggestion;
            }

            // Prevent cycles: Stop recursion if this item has already been visited
            if (visited.has(item.PlanId)) {
                return {
                    PrevSuggestion: realPrev,
                    NextSuggestion: next,
                };
            }
            visited.add(item.PlanId);

            // Recursive search for previous suggestion
            if (prevSuggestion === null && item.Prev !== null) {
                const res = machineUsage
                    .filter((y) => y.Plan.PlanId === item.Prev?.PlanId)
                    .map((x: MachineUsage) => {
                        const result = mapRes(x);
                        return findPlanFull(result);
                    })[0];
                if (res) {
                    const sug = determineClosestTime(res, visited);
                    realPrev = sug.PrevSuggestion;
                }
            }

            // Recursive search for next suggestion
            if (nextSuggestion === null && item.Next !== null) {
                const res = machineUsage
                    .filter((y) => y.Plan.PlanId === item.Next?.PlanId)
                    .map((x: MachineUsage) => {
                        const result = mapRes(x);
                        return findPlanFull(result);
                    })[0];
                if (res) {
                    const sug = determineClosestTime(res, visited);
                    next = sug.NextSuggestion;
                }
            }

            return {
                PrevSuggestion: realPrev,
                NextSuggestion: next,
            };
        };

        const result = determineClosestTime(colidingPlan[0])
        return result
    }
}


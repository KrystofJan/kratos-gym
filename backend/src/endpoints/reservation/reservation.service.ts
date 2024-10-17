import { BasicQueryDatabase } from "../../database"
import { logger } from "../../utils"
import { Reservation } from "."
import { safeAwait } from "../../utils/utilities"
import { CodedError, ErrorCode } from "../../errors/base.error"

export class ReservationService {

    static async GetAllReservationes(): Promise<Array<Reservation>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(Reservation));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: Reservation) => new Reservation(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllReservationes failed")
        }
    }

    static async GetReservationById(id: number): Promise<Reservation> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectSpecific(Reservation, id));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Reservation with an id: '${id}' was not found`)
        }

        const model = new Reservation(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetReservationById failed")
            logger.error(err)
            throw err;
        }
        return model;
    }

    static async UpdateReservationById(id: number, body: Partial<Reservation>): Promise<Reservation> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Update(Reservation, id, body));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Reservation with an id: '${id}' was not Deleted`)
        }

        const model = new Reservation(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetReservationById failed")
            logger.error(err)
            throw err;
        }

        return model;
    }


    static async DeleteReservationById(id: number): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Delete(Reservation, id));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Reservation with an id: '${id}' was not Deleted`)
        }

        return databaseResponse.Body;
    }

    static async CreateReservation(body: Reservation): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(Reservation, body));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        const model = new Reservation(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreateReservation failed")
            logger.error(err)
            throw err;
        }

        return Number(model.ReservationId);
    }
}


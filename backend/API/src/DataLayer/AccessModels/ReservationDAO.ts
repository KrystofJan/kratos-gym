import { RelationalModel } from "./RelationalModel.js";
import { Reservation } from '../../Models/Reservation.js'
import { TableTypes } from "../Database/TableTypes.js";
import { ReservationPostModel } from '../../Models/PostModels/ReservationPostModel.js';
import { DatabaseFail } from "../Database/DatabaseResponse.js";

export class ReservationDAO extends RelationalModel {

    constructor() {
        super(TableTypes.Reservation);
    }

    async SelectAllReservations() {
        try {
            const result = await this.dbHandler.SelectAll<Reservation>(Reservation)
            return result.Body;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async SelectReservationById(id: number) {
        try {
            const result = await this.dbHandler.SelectSpecific<Reservation>(Reservation, id)

            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }

    async InsertReservation(body: ReservationPostModel) {
        try {
            const result = this.Insert(body);
            return result;
        }
        catch (err) {
            throw new DatabaseFail(err as Error)
        }
    }
}

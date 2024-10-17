import { ErrorHandler } from "../../errors";
import { StatusCodes } from "http-status-codes";

class ReservationErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const reservationErrorHandler = new ReservationErrorHandler()

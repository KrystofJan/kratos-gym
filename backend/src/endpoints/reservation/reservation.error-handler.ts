import { ErrorHandler } from "../../errors";

class ReservationErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const reservationErrorHandler = new ReservationErrorHandler()

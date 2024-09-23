import { ErrorHandler } from "../../errors";
import { StatusCodes } from "http-status-codes";

class AddressErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const addressErrorHandler = new AddressErrorHandler()

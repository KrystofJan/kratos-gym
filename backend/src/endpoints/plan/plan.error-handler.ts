import { ErrorHandler } from "../../errors";
import { StatusCodes } from "http-status-codes";

class PlanErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const planErrorHandler = new PlanErrorHandler()

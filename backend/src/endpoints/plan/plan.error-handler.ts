import { ErrorHandler } from "../../errors";

class PlanErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const planErrorHandler = new PlanErrorHandler()

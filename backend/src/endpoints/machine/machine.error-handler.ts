import { ErrorHandler } from "../../errors";
import { StatusCodes } from "http-status-codes";

class MachineErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const machineErrorHandler = new MachineErrorHandler()

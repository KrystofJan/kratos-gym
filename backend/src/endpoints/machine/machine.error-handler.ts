import { ErrorHandler } from "../../errors";

class MachineErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const machineErrorHandler = new MachineErrorHandler()

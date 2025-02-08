import { ErrorHandler } from '../../errors'

class PlanGeneratorErrorHandler extends ErrorHandler {
    constructor() {
        super()
    }
}

export const planGeneratorErrorHandler = new PlanGeneratorErrorHandler()

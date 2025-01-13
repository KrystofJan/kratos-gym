import { ErrorHandler } from '../../errors'

class AccountErrorHandler extends ErrorHandler {
    constructor() {
        super()
    }
}

export const accountErrorHandler = new AccountErrorHandler()

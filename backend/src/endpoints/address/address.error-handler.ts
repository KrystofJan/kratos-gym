import { ErrorHandler } from '../../errors'

class AddressErrorHandler extends ErrorHandler {
    constructor() {
        super()
    }
}

export const addressErrorHandler = new AddressErrorHandler()

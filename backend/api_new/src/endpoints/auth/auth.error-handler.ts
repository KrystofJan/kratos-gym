
import { ErrorHandler } from "../../errors";

class AuthErrorHandler extends ErrorHandler {

    constructor() {
        super()
    }
}

export const authErrorHandler = new AuthErrorHandler()


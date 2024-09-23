import { StatusCodes } from "http-status-codes";
import { BaseError, ErrorCode } from ".";


export class ErrorHandler {

    private defaultHandler: Partial<Record<ErrorCode, StatusCodes>> = {
        [ErrorCode.INTERNAL_ERROR]: StatusCodes.INTERNAL_SERVER_ERROR,
        [ErrorCode.VALIDATION_ERROR]: StatusCodes.BAD_REQUEST,
        [ErrorCode.NOT_FOUND_ERROR]: StatusCodes.NOT_FOUND,
    }
    private handler: Partial<Record<ErrorCode, StatusCodes>> = {};

    constructor(handler?: Partial<Record<ErrorCode, StatusCodes>>) {
        if (handler) {
            this.handler = handler;
        }
    }

    protected setHandler(err: BaseError, status: StatusCodes): void {
        this.handler[err.code] = status;
    }

    public getHandler(errCode: ErrorCode): StatusCodes {
        return this.handler[errCode] || this.defaultHandler[errCode];
    }

    public handleError(err: BaseError): StatusCodes {
        return this.getHandler(err.code);
    }

}

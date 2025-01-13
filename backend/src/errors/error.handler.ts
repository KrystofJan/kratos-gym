import { StatusCodes } from 'http-status-codes'
import { CodedError, ErrorCode } from '.'

export class ErrorHandler {
    private defaultHandler: Record<ErrorCode, StatusCodes> = {
        [ErrorCode.INTERNAL_ERROR]: StatusCodes.INTERNAL_SERVER_ERROR,
        [ErrorCode.VALIDATION_ERROR]: StatusCodes.BAD_REQUEST,
        [ErrorCode.NOT_FOUND_ERROR]: StatusCodes.NOT_FOUND,
        [ErrorCode.MAPPING_ERROR]: StatusCodes.BAD_REQUEST,
        [ErrorCode.DATABASE_ERROR]: StatusCodes.INTERNAL_SERVER_ERROR,
        [ErrorCode.ARGUMENT_ERROR]: StatusCodes.BAD_REQUEST,
    }
    private handler: Partial<Record<ErrorCode, StatusCodes>> = {}

    constructor(handler?: Partial<Record<ErrorCode, StatusCodes>>) {
        if (handler) {
            this.handler = handler
        }
    }

    protected setHandler(err: CodedError, status: StatusCodes): void {
        this.handler[err.code] = status
    }

    public getHandler(errCode: ErrorCode): StatusCodes {
        return this.handler[errCode] || this.defaultHandler[errCode]
    }

    public handleError(err: CodedError): StatusCodes {
        return this.getHandler(err.code)
    }
}

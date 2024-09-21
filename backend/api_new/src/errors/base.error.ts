export enum ErrorCode {
    MappingError = 1000,
    ValidationError = 1001,
    NotFoundError = 1002,
    InternalError = 1003,
    DATABASE_ERROR = 1004,
    ARGUMENT_ERROR = 1005,
}

export abstract class BaseError extends Error {
    code: ErrorCode = ErrorCode.InternalError
}

export class InternalError extends BaseError {
    code: ErrorCode = ErrorCode.InternalError
    constructor(message: string) {
        super(message)
    }
}

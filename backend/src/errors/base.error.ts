export enum ErrorCode {
    MAPPING_ERROR = 1000,
    VALIDATION_ERROR = 1001,
    NOT_FOUND_ERROR = 1002,
    INTERNAL_ERROR = 1003,
    DATABASE_ERROR = 1004,
    ARGUMENT_ERROR = 1005,
}

export class CodedError extends Error {
    code: ErrorCode = ErrorCode.INTERNAL_ERROR
    constructor(code: ErrorCode, message: string) {
        super(message)
        this.code = code
    }
}

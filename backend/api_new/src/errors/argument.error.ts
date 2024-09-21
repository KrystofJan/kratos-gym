import { BaseError, ErrorCode } from './base.error';

export class ArgumentError extends BaseError {
    constructor(message: string) {
        super("Error while handeling arguments:" + message);
        this.code = ErrorCode.ARGUMENT_ERROR;
    }
}

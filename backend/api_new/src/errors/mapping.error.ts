import { BaseError, ErrorCode } from './base.error';

export class MappingError extends BaseError {
    constructor(message: string) {
        super("could not map the response\nLine:" + message);
        this.code = ErrorCode.MappingError;
    }
}

import { Model } from "../endpoints/Model";
import { BaseError, ErrorCode } from "../errors/base.error";

export interface DatabaseResponse<T> {
    Body: T;
}

// TODO: Dont use any
export class DatabaseFoundSingle<T extends Model> implements DatabaseResponse<T> {
    public Body: T
    constructor(body: T) {
        this.Body = body;
    }
}

export class DatabaseFoundMultiple<T extends Model> implements DatabaseResponse<Array<T>> {
    public Body: Array<T>
    constructor(body: Array<T>) {
        this.Body = body;
    }
}


export class DatabaseCreated<T> implements DatabaseResponse<T> {
    public Body: T

    constructor(body: T) {
        this.Body = body;
    }
}

// TODO: Move to errors
export class DatabaseFail extends BaseError {
    public ErrorMessage: string;
    private Error: Error;

    constructor(err: Error) {
        super(err.toString());
        this.Error = err;
        this.ErrorMessage = this.Error.toString();
        this.code = ErrorCode.DATABASE_ERROR;
    }
}


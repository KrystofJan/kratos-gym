import { IDictionary } from "../utils";
import { ResponseStatus } from '../request-utility';
import { Model } from "../endpoints/Model";

export interface DatabaseResponse {
    Status: ResponseStatus;
}

// TODO: Dont use any
export class DatabaseFoundSingle implements DatabaseResponse {
    public Status: ResponseStatus;
    public Body: Model
    constructor(body: Model) {
        this.Status = ResponseStatus.SUCCESS;
        this.Body = body;
    }
}

export class DatabaseFoundMultiple implements DatabaseResponse {
    public Status: ResponseStatus;
    public Body: Array<Model>
    constructor(body: Array<Model>) {
        this.Status = ResponseStatus.SUCCESS;
        this.Body = body;
    }
}


export class DatabaseCreated implements DatabaseResponse {
    public Status: ResponseStatus;
    public Body: Model

    constructor(body: Model) {
        this.Status = ResponseStatus.SUCCESS;
        this.Body = body;
    }
}

// TODO: Dont use string
export class DatabaseFail extends Error implements DatabaseResponse {
    public Status: ResponseStatus;
    public ErrorMessage: string;
    private Error: Error;

    constructor(err: Error) {
        super(err.toString());
        this.Status = ResponseStatus.FAIL;
        this.Error = err;
        this.ErrorMessage = this.Error.toString();
    }
}

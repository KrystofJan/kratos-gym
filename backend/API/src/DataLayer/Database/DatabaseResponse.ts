import { IDictionary } from "../../utils/Utilities.js";
import { ResponseStatus } from '../../RequestUtility/common/ResponseStatus.js';

export interface DatabaseResponse {
    Status: ResponseStatus;
}

// TODO: Dont use any
export class DatabaseSuccess implements DatabaseResponse {
    public Status: ResponseStatus;
    public Body: Array<IDictionary<any>> | number | any;
    constructor(body: Array<IDictionary<any>> | number | any) {
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

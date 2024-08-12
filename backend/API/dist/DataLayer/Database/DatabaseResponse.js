import { ResponseStatus } from '../../RequestUtility/common/ResponseStatus.js';
// TODO: Dont use any
export class DatabaseSuccess {
    constructor(body) {
        this.Status = ResponseStatus.SUCCESS;
        this.Body = body;
    }
}
// TODO: Dont use string
export class DatabaseFail extends Error {
    constructor(err) {
        super(err.toString());
        this.Status = ResponseStatus.FAIL;
        this.Error = err;
        this.ErrorMessage = this.Error.toString();
    }
}

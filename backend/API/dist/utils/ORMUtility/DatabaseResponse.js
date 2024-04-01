import { ResponseStatus } from '../common/ResponseStatus.js';
// TODO: Dont use any
var DatabaseSuccess = /** @class */ (function () {
    function DatabaseSuccess(body) {
        this.Status = ResponseStatus.SUCCESS;
        this.Body = body;
    }
    return DatabaseSuccess;
}());
export { DatabaseSuccess };
// TODO: Dont use string
var DatabaseFail = /** @class */ (function () {
    function DatabaseFail(err) {
        this.Status = ResponseStatus.SUCCESS;
        this.Error = err;
    }
    return DatabaseFail;
}());
export { DatabaseFail };

import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
var LoggedInResponse = /** @class */ (function () {
    function LoggedInResponse(message, userId) {
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            userId: userId
        };
    }
    LoggedInResponse.prototype.buildResponse = function (req, res) {
        console.log(this.Body);
        res.status(this.StatusCode).json(this.Body);
    };
    return LoggedInResponse;
}());
export { LoggedInResponse };

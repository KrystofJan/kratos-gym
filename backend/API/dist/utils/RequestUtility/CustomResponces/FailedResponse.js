import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
var FailedResponse = /** @class */ (function () {
    function FailedResponse(message) {
        this.StatusCode = StatusCodeType.INTERNAL_SERVER_ERROR;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        };
    }
    FailedResponse.prototype.buildResponse = function (req, res) {
        res.status(this.StatusCode).json(this.Body);
    };
    return FailedResponse;
}());
export { FailedResponse };

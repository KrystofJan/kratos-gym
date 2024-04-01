import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
var NotFoundResponse = /** @class */ (function () {
    function NotFoundResponse(message) {
        this.StatusCode = StatusCodeType.NOT_FOUND;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        };
    }
    NotFoundResponse.prototype.buildResponse = function (req, res) {
        res.status(this.StatusCode).json(this.Body);
    };
    return NotFoundResponse;
}());
export { NotFoundResponse };

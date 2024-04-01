import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
var BadRequestResponse = /** @class */ (function () {
    function BadRequestResponse(message) {
        this.StatusCode = StatusCodeType.BAD_REQUEST;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        };
    }
    BadRequestResponse.prototype.buildResponse = function (req, res) {
        res.status(this.StatusCode).json(this.Body);
    };
    return BadRequestResponse;
}());
export { BadRequestResponse };

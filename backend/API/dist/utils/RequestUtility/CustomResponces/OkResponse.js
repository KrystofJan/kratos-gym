import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
var OkResponse = /** @class */ (function () {
    function OkResponse(message, body) {
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            Body: body
        };
    }
    return OkResponse;
}());
export { OkResponse };

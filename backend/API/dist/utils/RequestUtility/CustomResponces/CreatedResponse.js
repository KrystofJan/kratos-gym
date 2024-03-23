import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
var CreatedResponse = /** @class */ (function () {
    function CreatedResponse(message, createdId) {
        this.StatusCode = StatusCodeType.CREATED;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            CreatedId: createdId
        };
    }
    return CreatedResponse;
}());
export { CreatedResponse };

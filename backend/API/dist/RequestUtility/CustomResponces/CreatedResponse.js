import { StatusCodeType } from './Response.js';
import { ResponseStatus } from '../common/ResponseStatus.js';
var CreatedResponse = /** @class */ (function () {
    function CreatedResponse(message, createdId) {
        this.StatusCode = StatusCodeType.CREATED;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            CreatedId: createdId
        };
    }
    CreatedResponse.prototype.buildResponse = function (req, res) {
        res.status(this.StatusCode).json(this.Body);
    };
    return CreatedResponse;
}());
export { CreatedResponse };
var CreatedMultipleResponse = /** @class */ (function () {
    function CreatedMultipleResponse(message, createdIds) {
        this.StatusCode = StatusCodeType.CREATED;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            CreatedIds: createdIds
        };
    }
    CreatedMultipleResponse.prototype.buildResponse = function (req, res) {
        res.status(this.StatusCode).json(this.Body);
    };
    return CreatedMultipleResponse;
}());
export { CreatedMultipleResponse };

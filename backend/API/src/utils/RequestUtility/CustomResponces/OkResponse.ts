import { Response, StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
import { GetResponseBody } from './ResponseBody.js';
import { Model } from '../../../ORM/Models/Model.js';

export class OkResponse implements Response {
    StatusCode: StatusCodeType;
    Body: GetResponseBody;

    constructor(message: string, body: Array<Model> | Model){
        this.StatusCode = StatusCodeType.OK;
        this.Body = {
            status: ResponseStatus.SUCCESS,
            message: message,
            Body: body
        }
    }
}
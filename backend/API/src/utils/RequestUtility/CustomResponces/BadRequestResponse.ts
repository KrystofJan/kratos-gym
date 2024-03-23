import { IDictionary } from "../../Utilities.js";
import { Response, StatusCodeType } from './Response.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';
import { ResponseBody} from './ResponseBody.js';

export class BadRequestResponse implements Response {
    StatusCode: StatusCodeType;
    Body: ResponseBody;

    constructor(message: string){
        this.StatusCode = StatusCodeType.BAD_REQUEST;
        this.Body = {
            status: ResponseStatus.FAIL,
            message: message
        }
    }
}

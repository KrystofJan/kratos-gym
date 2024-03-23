import { Model } from '../../../ORM/Models/Model.js';
import { IDictionary } from '../../Utilities.js';
import { ResponseStatus } from '../../common/ResponseStatus.js';

export interface ResponseBody {
    readonly status: ResponseStatus;
    readonly message: string;
}

export interface PostResponseBody extends ResponseBody {
    readonly CreatedId: number;
}


export interface GetResponseBody extends ResponseBody {
    readonly Body: Array<IDictionary<any>> | IDictionary<any> ;
}


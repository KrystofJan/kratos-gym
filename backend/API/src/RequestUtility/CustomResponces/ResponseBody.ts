import { Model } from '../../Models/Model.js';
import { IDictionary } from '../../utils/Utilities.js';
import { ResponseStatus } from '../common/ResponseStatus.js';

export interface ResponseBody {
    readonly status: ResponseStatus;
    readonly message: string;
}

export interface PostResponseBody extends ResponseBody {
    readonly CreatedId: number;
}


export interface GetResponseBody extends ResponseBody {
    Body: Array<Model> | Model;
}


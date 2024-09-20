import { Model } from '../../endpoints/Model';
import { ResponseStatus } from '../common/response-status';

export interface ResponseBody {
    readonly status: ResponseStatus;
    readonly message: string;
}

export interface ErrorResponseBody extends ResponseBody {
    readonly error_code: number;
}

export interface PostResponseBody extends ResponseBody {
    readonly CreatedId: number;
}

export interface PostMultipleResponseBody extends ResponseBody {
    readonly CreatedIds: Array<number>;
}

export interface GetResponseBody extends ResponseBody {
    Body: Array<Model> | Model;
}

export interface LogInResponseBody extends ResponseBody {
    readonly userId: number;
}

import { Model } from '../../endpoints/base';
import { Suggestion } from '../../endpoints/machine';
import { ResponseStatus } from '../common/response-status';

export interface ResponseBody {
    readonly status: ResponseStatus;
    readonly message: string;
}

export interface ErrorResponseBody extends ResponseBody {
    readonly error_code: number;
}

export interface PostResponseBody extends ResponseBody {
    readonly CreatedId: number | Model;
}

export interface DelelteResponseBody extends ResponseBody {
    readonly DeletedId: number;
}

export interface PostMultipleResponseBody extends ResponseBody {
    readonly CreatedIds: Array<number>;
}

export interface GetResponseBody extends ResponseBody {
    Body: Array<Model> | Model | Suggestion;
}

export interface LogInResponseBody extends ResponseBody {
    readonly userId: number;
}

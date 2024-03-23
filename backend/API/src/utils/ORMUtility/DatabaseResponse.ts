import mysql  from 'mysql2';
import { IDictionary } from "../Utilities.js";
import { ResponseStatus } from '../common/ResponseStatus.js';

export interface DatabaseResponse {
    Status: ResponseStatus;
} 

// TODO: Dont use any
export class DatabaseSuccess implements DatabaseResponse{
    Status: ResponseStatus;
    Body: Array<IDictionary<any>> | number | any;
    constructor(body: Array<IDictionary<any>> | number| any){
        this.Status = ResponseStatus.SUCCESS;
        this.Body = body;
    }
}
// TODO: Dont use string
export class DatabaseFail implements DatabaseResponse{
    Status: ResponseStatus;
    Error: mysql.QueryError | string;
    
    constructor(err: mysql.QueryError | string){
        this.Status = ResponseStatus.SUCCESS;
        this.Error = err;
    }
}

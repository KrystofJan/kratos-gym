import { Model } from "../endpoints/Model";

export interface DatabaseResponse<T> {
    Body: T;
}

// TODO: Dont use any
export class DatabaseFoundSingle<T extends Model> implements DatabaseResponse<T> {
    public Body: T
    constructor(body: T) {
        this.Body = body;
    }
}

export class DatabaseFoundMultiple<T extends Model> implements DatabaseResponse<Array<T>> {
    public Body: Array<T>
    constructor(body: Array<T>) {
        this.Body = body;
    }
}


export class DatabaseCreated<T> implements DatabaseResponse<T> {
    public Body: T

    constructor(body: T) {
        this.Body = body;
    }
}


export class DatabaseDeleted implements DatabaseResponse<number> {
    public Body: number
    constructor(deletedId: number) {
        this.Body = deletedId
    }
}


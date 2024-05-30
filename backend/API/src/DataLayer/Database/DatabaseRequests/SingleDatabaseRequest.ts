import { Database } from "../Database.js";
import { DatabaseResponse } from "../DatabaseResponse.js";
import { IDatabaseRequest } from "./IDatabaseRequest.js";

export class SimpleDatabaseRequest implements IDatabaseRequest {
    private func: Function;
    constructor(func: Function) {
        this.func = func;
    }

    async execute(): Promise<DatabaseResponse> {
        Database.dbConnect();
        const result = await this.func();
        Database.dbDisconnect();
        return result;
    }
}


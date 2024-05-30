import { Database } from "../Database.js";
import { BaseDatabaseDecorator } from "../DatabaseDecorators/DatabaseDecorator.js";
import { DatabaseResponse } from "../DatabaseResponse.js";
import { IDatabaseRequest } from "../DatabaseRequests/IDatabaseRequest.js";

export class DatabaseRequestDecorator extends BaseDatabaseDecorator {

    constructor(req: IDatabaseRequest) {
        super(req);
    }

    async execute(): Promise<DatabaseResponse> {
        return super.execute();
    }
}

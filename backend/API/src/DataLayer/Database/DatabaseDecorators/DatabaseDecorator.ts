import { DatabaseResponse } from "../DatabaseResponse.js";
import { IDatabaseRequest } from "../DatabaseRequests/IDatabaseRequest.js";

export abstract class BaseDatabaseDecorator implements IDatabaseRequest {
    protected request: IDatabaseRequest;

    constructor(req: IDatabaseRequest) {
        this.request = req;
    }

    async execute(): Promise<DatabaseResponse> {
        const result = this.request.execute();
        return result;
    }
}

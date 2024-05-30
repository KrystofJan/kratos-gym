import { DatabaseResponse } from "../DatabaseResponse.js";

export interface IDatabaseRequest {
    execute(): Promise<DatabaseResponse>;
}

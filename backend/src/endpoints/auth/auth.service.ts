import { BasicQueryDatabase } from "../../database"
import { Auth } from "./auth.model"
import { Account } from "../account/account.model"
import { safeAwait } from "../../utils/utilities"
import { CodedError, ErrorCode } from "../../errors/base.error"

export class AuthService {

    static async CreateAddress(body: Auth): Promise<Account> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(Auth, body));
        if (databaseErr !== null) {
            throw databaseErr;
        }

        const model = new Account(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreateAddress failed")
            throw err;
        }

        return model;
    }
}

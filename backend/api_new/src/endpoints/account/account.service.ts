import { Database } from "../../database"
import { logger } from "../../utils"
import { Account } from "./account.model"
import { CodedError, ErrorCode } from "../../errors/base.error"
import { safeAwait } from "../../utils/utilities"
import { DecoratorType } from "../../database/decorators/database-decorators"

export class AccountService {

    static async GetAllAccounts(): Promise<Array<Account>> {
        const db = new Database()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(Account));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: Account) => new Account(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAccount failed")
        }
    }

    static async GetAccountById(id: number): Promise<Account> {
        const db = new Database()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectSpecific(Account, id));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Account with an id: '${id}' was not found`)
        }

        const model = new Account(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAccountById failed")
            logger.error(err)
            throw err;
        }
        return model;
    }

    static async GetAccountByClerkId(clerkId: string): Promise<Account> {
        const db = new Database()

        const colMap = Reflect.getMetadata(DecoratorType.COLUMN_MAP, Account.prototype)

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAttrIs(Account, clerkId, colMap["ClerkId"]));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Account with an clerk id: '${clerkId}' was not found`)
        }

        const model = new Account(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAccountById failed")
            logger.error(err)
            throw err;
        }
        return model;
    }
}

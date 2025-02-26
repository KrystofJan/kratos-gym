import { BasicQueryDatabase } from '../../database'
import { logger } from '../../utils'
import { Account, UserRole } from './account.model'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { safeAwait } from '../../utils/utilities'
import { DecoratorType } from '../../database/decorators/database-decorators'
import { Address } from '../address'

export class AccountService {
    static async GetAllAccounts(): Promise<Array<Account>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectAll(Account)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        try {
            const models = databaseResponse.Body.map(
                (model: Account) => new Account(model)
            )
            return models
        } catch (err) {
            logger.error(err)
            throw new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAllAccount failed'
            )
        }
    }

    static async GetAllAccountsByRole(role: UserRole): Promise<Array<Account>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectAttrIs(Account, role.toString().toLowerCase(), 'role')
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        try {
            let models: Account[]
            if (Array.isArray(databaseResponse.Body)) {
                models = databaseResponse.Body.map(
                    (model: Account) => new Account(model)
                )
            } else {
                models = []
                const model = new Account(databaseResponse.Body)
                if (!model) {
                    const err = new CodedError(
                        ErrorCode.MAPPING_ERROR,
                        'Mapping model at GetAllAccoutsByRole failed'
                    )
                    throw err
                }

                model.Address = new Address(databaseResponse.Body)
                models.push(model)
            }
            return models
        } catch (err) {
            logger.error(err)
            throw new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAllAccount failed'
            )
        }
    }
    static async GetAccountById(id: number): Promise<Account> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectSpecific(Account, id)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(
                ErrorCode.NOT_FOUND_ERROR,
                `Account with an id: '${id}' was not found`
            )
        }

        const model = new Account(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAccountById failed'
            )
            throw err
        }
        return model
    }

    static async SetAddressIdById(
        id: number,
        body: Partial<Account>
    ): Promise<Account> {
        const db = new BasicQueryDatabase()
        console.log(body)

        const [databaseErr, databaseResponse] = await safeAwait(
            db.Update(Account, id, body)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        const model = new Account(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAccountById failed'
            )
            throw err
        }

        model.Address = new Address(databaseResponse.Body)
        return model
    }

    static async UpdateAccount(
        id: number,
        body: Partial<Account>
    ): Promise<Account> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.Update(Account, id, body)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        const model = new Account(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAccountById failed'
            )
            throw err
        }

        return model
    }

    static async GetAccountByClerkId(clerkId: string): Promise<Account> {
        const db = new BasicQueryDatabase()

        const colMap = Reflect.getMetadata(
            DecoratorType.COLUMN_MAP,
            Account.prototype
        )

        const [databaseErr, databaseResponse] = await safeAwait(
            db.SelectAttrIs(Account, clerkId, colMap['ClerkId'])
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(
                ErrorCode.NOT_FOUND_ERROR,
                `Account with an clerk id: '${clerkId}' was not found`
            )
        }

        const model = new Account(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(
                ErrorCode.MAPPING_ERROR,
                'Mapping model at GetAccountById failed'
            )
            throw err
        }
        return model
    }
}

import { BasicQueryDatabase } from '../../database'
import { logger } from '../../utils'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { safeAwait } from '../../utils/utilities'
import { DecoratorType } from '../../database/decorators/database-decorators'
import { Address } from '../address'
import { TestingModel } from './testing.model'
import { TestingDatabase } from './testing.database'

export class TestingService {
    static async GetDBId(name: string, col: string): Promise<TestingModel> {
        const db = new TestingDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(
            db.FindLastDBId(name, col)
        )
        if (databaseErr !== null) {
            throw databaseErr
        }

        return new TestingModel(databaseResponse)
    }
}

import { IDictionary } from '../../utils'
import { DatabaseCreated } from '../../database/database-response'
import { Model } from '../base'
import { logger } from '../../utils/logger'
import { DatabaseType, SimpleDatabaseType } from '../../utils/utilities'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { Database } from '../../database'
import { DecoratorType } from '../../database/decorators/database-decorators'
import { Plan } from '../plan'
import { MachinesInPlan } from '../plan/machines-in-plan.model'
import { ExerciseCategory } from '../exercise-category'
import { safeAwait } from '../../utils/utilities'
import { TestingModel } from './testing.model'

export class TestingDatabase extends Database {
    constructor() {
        super()
    }

    async FindLastDBId(
        tableName: string,
        tableColumn: string
    ): Promise<number> {
        try {
            const [result] = await this.sql`
		select ${this.sql(tableColumn)} as id 
		from ${this.sql(tableName)} 
		order by ${this.sql(tableColumn)} desc 
		limit 1
	    `
            logger.info(
                `Select all from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`
            )
            return result.id as number
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }
}

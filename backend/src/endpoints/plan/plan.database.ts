import {
    DatabaseDeleted,
    DatabaseFoundSingle,
    DatabaseFoundMultiple,
    DatabaseCreated,
} from '../../database/database-response'
import { logger } from '../../utils/logger'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { Database } from '../../database'
import { MachinesInPlan } from './machines-in-plan.model'
import { Plan } from './plan.model'
import { format } from 'date-fns'

export class PlanDatabase extends Database {
    constructor() {
        super()
    }

    async SelectMachinesUsedOnDate(id: number, date: Date) {
        // NOTE: make this one more time without id, so it returns all plans from here
        //
        // another option i can add all machines selected in body and find in array query
        try {
            const result: Plan[] = await this.sql<Plan[]>`
                select ${this.sql('plan')}.* 
                from ${this.sql('plan_machine')} 
                    inner join ${this.sql('plan')} 
                        on ${this.sql('plan_machine')}.${this.sql('plan_id')} = ${this.sql('plan')}.${this.sql('plan_id')}
                    inner join ${this.sql('reservation')} 
                        on ${this.sql('plan')}.${this.sql('plan_id')} = ${this.sql('reservation')}.${this.sql('plan_id')}
                    where machine_id = ${id}
                        and TO_CHAR(reservation_time, 'YYYY-MM-DD') = ${format(date, 'yyyy-MM-dd')}
`
            logger.info(
                `Recommend machine reuqest was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundMultiple<Plan>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }
}

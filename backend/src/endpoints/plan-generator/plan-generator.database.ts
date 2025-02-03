import { DatabaseFoundMultiple } from '../../database/database-response'
import { logger } from '../../utils/logger'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { Database } from '../../database'
import { format } from 'date-fns'
import { Time } from '@internationalized/date'
import { Model } from '../base'

export class PlanGeneratorDatabase extends Database {
    constructor() {
        super()
    }

    async Select(
        reservation_date: Date,
        start_time: Time,
        amount_of_people: number,
        machine_ids: number[]
    ) {
        try {
            const result = await this.sql`
                select * 
                from ${this.sql('plan_machine')} 
                    inner join ${this.sql('machine')} 
                        on ${this.sql('plan_machine')}.${this.sql('machine_id')} = ${this.sql('machine')}.${this.sql('machine_id')}
                    inner join ${this.sql('reservation')} 
                        on ${this.sql('plan')}.${this.sql('plan_id')} = ${this.sql('reservation')}.${this.sql('plan_id')}
                WHERE reservation_time::date = ${format(reservation_date, 'yyyy-MM-dd')}::date
                AND start_time > '${start_time.hour}:${start_time.minute}'::time
                AND machine.max_people >= reservation.amount_of_people + ${amount_of_people}
                AND (end_time - start_time) > (machine.avg_time_taken || ' seconds')::INTERVAL
                And machine.machine_id in (${machine_ids.join(', ')})
                ORDER BY start_time, end_time;
`
            logger.info(
                `Recommend machine reuqest was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundMultiple<any>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }
}

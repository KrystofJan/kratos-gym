import { DatabaseFoundMultiple } from '../../database/database-response'
import { logger } from '../../utils/logger'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { Database } from '../../database'
import { format } from 'date-fns'
import { GeneratorPost } from './plan-generator-request.model'
import { Model } from '../base'
import { Time } from '@internationalized/date'

export class PlanGeneratorDatabase extends Database {
    constructor() {
        super()
    }

    async Select(ops: GeneratorPost) {
        const { reservation_date, start_time, amount_of_people, machine_ids } =
            ops
        try {
            const formattedStartTime = `${String(start_time.hour).padStart(2, '0')}:${String(start_time.minute).padStart(2, '0')}:00`
            /**
 *
 *
                select * 
                from ${this.sql('plan_machine')} 
                    inner join ${this.sql('machine')} 
                        on ${this.sql('plan_machine')}.${this.sql('machine_id')} = ${this.sql('machine')}.${this.sql('machine_id')}
                    inner join ${this.sql('reservation')} 
                        on ${this.sql('plan_machine')}.${this.sql('plan_id')} = ${this.sql('reservation')}.${this.sql('plan_id')}
                WHERE reservation_time::date = ${reservation_date}::date
                AND start_time >= ${formattedStartTime}::time
                AND machine.max_people >= reservation.amount_of_people + ${amount_of_people}
                AND (end_time - start_time) > (machine.avg_time_taken || ' seconds')::INTERVAL
                And machine.machine_id = ANY(${machine_ids})
                ORDER BY start_time, end_time;
 */
            // Maybe we dont check for max people?
            const result = await this.sql<Model[]>`
                select * 
                from ${this.sql('plan_machine')} 
                    inner join ${this.sql('machine')} 
                        on ${this.sql('plan_machine')}.${this.sql('machine_id')} = ${this.sql('machine')}.${this.sql('machine_id')}
                    inner join ${this.sql('reservation')} 
                        on ${this.sql('plan_machine')}.${this.sql('plan_id')} = ${this.sql('reservation')}.${this.sql('plan_id')}
                WHERE reservation_time::date = ${reservation_date}::date
                AND start_time >= ${formattedStartTime}::time
                And machine.machine_id = ANY(${machine_ids})
                ORDER BY start_time, end_time;
`
            logger.info(
                `Recommend machine reuqest was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundMultiple<Model>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }
}

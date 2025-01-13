import {
    DatabaseDeleted,
    DatabaseFoundSingle,
    DatabaseFoundMultiple,
    DatabaseCreated,
} from '../../database/database-response'
import { logger } from '../../utils/logger'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { Database } from '../../database'
import { Machine } from './machine.model'
import { format } from 'date-fns'
import { MachineUsage } from '.'

export class MachineDatabase extends Database {
    constructor() {
        super()
    }

    async SelectMachinesWithinTheSameCategory(id: number) {
        try {
            const result: Machine[] = await this.sql<Machine[]>`
                SELECT * 
                FROM get_machines_in_same_category(${id})
            `
            logger.info(
                `Recommend machine reuqest was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundMultiple<Machine>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async SelectMachineUsageByDate(
        id: number,
        date: Date,
        amount_of_people: number
    ) {
        try {
            const result: MachineUsage[] = await this.sql<MachineUsage[]>`
                SELECT * 
                FROM get_plan_machines_occupancy_for_reservation(${id}, ${format(date, 'yyyy-MM-dd')}, ${amount_of_people})
            `
            logger.info(
                `GetMachineUsage requestwas successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundMultiple<MachineUsage>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async CheckIfCanFit(
        id: number,
        date: Date,
        amount_of_people: number
    ): Promise<boolean> {
        interface Result {
            check_can_fit: boolean
        }
        try {
            const result: Result[] = await this.sql<Result[]>`
                select * from check_can_fit(${id}, ${id}, ${format(date, 'yyyy-MM-dd')}, ${amount_of_people})
            `
            return result[0].check_can_fit
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }
}

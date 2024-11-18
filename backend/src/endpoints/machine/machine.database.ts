
import { DatabaseDeleted, DatabaseFoundSingle, DatabaseFoundMultiple, DatabaseCreated } from '../../database/database-response';
import { logger } from '../../utils/logger';
import { CodedError, ErrorCode } from '../../errors/base.error';
import { Database } from '../../database';
import { Machine } from './machine.model';

export class MachineDatabase extends Database {
    constructor() {
        super()
    }

    async SelectMachinesWithinTheSameCategory(id: number) {

        try {
            const result: Machine[] = await this.sql<Machine[]>`
                SELECT * 
                FROM get_machines_in_same_category(${id})
            `;
            logger.info(`Recommend machine reuqest was successful\n${JSON.stringify(result, null, 4)}`)
            return new DatabaseFoundMultiple<Machine>(result);
        } catch (error) {
            const err = error as Error;
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }


}

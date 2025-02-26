import { IDictionary } from '../../utils'
import {
    DatabaseDeleted,
    DatabaseFoundSingle,
    DatabaseFoundMultiple,
    DatabaseCreated,
} from '../../database/database-response'
import { Model } from '../base'
import { Reservation } from './reservation.model'
import { logger } from '../../utils/logger'
import { DatabaseType, SimpleDatabaseType } from '../../utils/utilities'
import { CodedError, ErrorCode } from '../../errors/base.error'
import { Database } from '../../database'
import { DecoratorType } from '../../database/decorators/database-decorators'
import { Plan } from '../plan'
import { MachinesInPlan } from '../plan/machines-in-plan.model'
import { ExerciseType } from '../exercise-type'
import { ExerciseCategory } from '../exercise-category'
import { safeAwait } from '../../utils/utilities'

export class ReservationDatabase extends Database {
    constructor() {
        super()
    }

    async ProcessInsertData<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        body: T
    ) {
        const columnMap = Reflect.getMetadata(
            DecoratorType.COLUMN_MAP,
            modelType.prototype
        )
        const tableName = Reflect.getMetadata(
            DecoratorType.TABLE_NAME,
            modelType
        )
        const foreignKeyMap = Reflect.getMetadata(
            DecoratorType.FOREIGN_KEY_MAP,
            modelType.prototype
        )
        const unInsertables = Reflect.getMetadata(
            DecoratorType.UNINSERTABLE,
            modelType.prototype
        )

        // Filter out null or undefined values from the body
        const filteredBody = Object.fromEntries(
            Object.entries(body).filter(([, value]) => value != null)
        )
        const columns: string[] = Object.keys(filteredBody)

        const processedData: IDictionary<SimpleDatabaseType> = {}

        try {
            for (const column of columns) {
                if (unInsertables?.includes(column)) {
                    continue
                }
                const columnMapped = columnMap[column]

                // Handle foreign key mapping
                if (foreignKeyMap?.[columnMapped]) {
                    const [, fkPrototype] = foreignKeyMap[columnMapped]
                    const foreignKey = Reflect.getMetadata(
                        'primaryKey',
                        fkPrototype
                    )
                    const fieldMap = Reflect.getMetadata(
                        'fieldMap',
                        fkPrototype.prototype
                    )

                    processedData[columnMapped] =
                        filteredBody[column][fieldMap[foreignKey]]
                } else {
                    // Handle boolean conversion
                    processedData[columnMapped] = filteredBody[column]
                }
            }
        } catch (error) {
            const err = error as Error
            logger.error(err)
            throw new CodedError(
                ErrorCode.INTERNAL_ERROR,
                'Error processing body data.'
            )
        }

        const columnNames = Object.keys(processedData)
        return [tableName, processedData, columnNames]
    }

    async InsertFullReservation(body: Reservation) {
        // Flow:
        // 1. Create a plan
        // 2. Create plan machines
        // 3. Create plan types
        // 4. Create reservations
        //
        // TODO: Add to docs

        if (!body.Plan) {
            throw new CodedError(
                ErrorCode.ARGUMENT_ERROR,
                'Plan has to be in the request body'
            )
        }
        const [planTableName, planProcessedData, planColumnNames] =
            await this.ProcessInsertData(Plan, body.Plan)

        try {
            const res = await this.sql.begin(async (sql) => {
                const [planErr, pl] = await safeAwait(sql<Plan[]>`
                    insert into ${sql(planTableName)} 
                    ${sql(planProcessedData, planColumnNames)}
                    returning *
                `)

                if (planErr !== null) {
                    logger.error(planErr)
                    throw new CodedError(
                        ErrorCode.DATABASE_ERROR,
                        'Could not create plan'
                    )
                }

                const [plan] = pl

                const planModel = new Plan(plan)
                const machines = []
                const types = []
                if (!body.Plan) {
                    throw new CodedError(
                        ErrorCode.MAPPING_ERROR,
                        'Mapping the plan failed '
                    )
                }

                for (const machineInPlan of body.Plan.Machines) {
                    machineInPlan.PlanId = planModel.PlanId

                    const [mTableName, mProcessedData, mColumnNames] =
                        await this.ProcessInsertData(
                            MachinesInPlan,
                            machineInPlan
                        )

                    logger.info(mProcessedData)
                    const [machineErr, ma] = await safeAwait(sql<Model[]>`
                        insert into ${sql(mTableName)} 
                        ${sql(mProcessedData, mColumnNames)}
                        returning *
                    `)

                    if (machineErr !== null) {
                        logger.error(machineErr)
                        throw new CodedError(
                            ErrorCode.DATABASE_ERROR,
                            'Could not create machine'
                        )
                    }

                    const [machine] = ma
                    machines.push(new MachinesInPlan(machine))
                }

                planModel.Machines = machines

                const typePKey: string = Reflect.getMetadata(
                    DecoratorType.PRIMARY_KEY,
                    ExerciseCategory
                )
                for (const exType of body.Plan.ExerciseCategories) {
                    const [typeErr, tp] = await safeAwait(sql<Model[]>`
                        insert into ${sql('plan_category')} 
                        (${sql(typePKey)}, ${sql('plan_id')})
                        values (${exType.CategoryId}, ${planModel.PlanId})
                        returning *
                    `)

                    if (typeErr !== null) {
                        logger.error(typeErr)
                        throw new CodedError(
                            ErrorCode.DATABASE_ERROR,
                            'Could not create type'
                        )
                    }

                    const [type] = tp
                    types.push(new ExerciseCategory(type))
                }

                planModel.ExerciseCategories = types
                body.Plan = planModel

                const [resTableName, resProcessedData, resColumnNames] =
                    await this.ProcessInsertData(Reservation, body)
                const [reservationErr, re] = await safeAwait(sql<Reservation[]>`
                    insert into ${sql(resTableName)} 
                    ${sql(resProcessedData, resColumnNames)}
                    returning *
                `)

                if (reservationErr !== null) {
                    logger.error(reservationErr)
                    throw new CodedError(
                        ErrorCode.DATABASE_ERROR,
                        'Could not create reservation'
                    )
                }
                const [reservation] = re
                return reservation
            })
            return new DatabaseCreated<Reservation>(res)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }
}

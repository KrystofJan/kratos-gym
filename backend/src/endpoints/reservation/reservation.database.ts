import { IDictionary } from '../../utils';
import { DatabaseDeleted, DatabaseFoundSingle, DatabaseFoundMultiple, DatabaseCreated } from '../../database/database-response';
import { Model } from '../base';
import { Reservation } from './reservation.model';
import { logger } from '../../utils/logger';
import { DatabaseType, SimpleDatabaseType } from '../../utils/utilities';
import { CodedError, ErrorCode } from '../../errors/base.error';
import { Database } from '../../database';
import { DecoratorType } from '../../database/decorators/database-decorators'
import { Plan } from '../plan';
import { MachinesInPlan } from '../plan/machines-in-plan.model';
import { ExerciseType } from '../exercise-type';
import { ExerciseCategory } from '../exercise-category';

export class ReservationDatabase extends Database {
    constructor() {
        super()
    }

    async ProcessInsertData<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        body: T
    ) {
        const columnMap = Reflect.getMetadata(DecoratorType.COLUMN_MAP, modelType.prototype);
        const tableName = Reflect.getMetadata(DecoratorType.TABLE_NAME, modelType);
        const foreignKeyMap = Reflect.getMetadata(DecoratorType.FOREIGN_KEY_MAP, modelType.prototype);
        const unInsertables = Reflect.getMetadata(DecoratorType.UNINSERTABLE, modelType.prototype);

        // Filter out null or undefined values from the body
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([, value]) => value != null));
        const columns: string[] = Object.keys(filteredBody);


        const processedData: IDictionary<SimpleDatabaseType> = {};

        try {
            for (const column of columns) {
                if (unInsertables?.includes(column)) {
                    continue;
                }
                const columnMapped = columnMap[column];

                // Handle foreign key mapping
                if (foreignKeyMap?.[columnMapped]) {
                    const [, fkPrototype] = foreignKeyMap[columnMapped];
                    const foreignKey = Reflect.getMetadata('primaryKey', fkPrototype);
                    const fieldMap = Reflect.getMetadata('fieldMap', fkPrototype.prototype);

                    processedData[columnMapped] = filteredBody[column][fieldMap[foreignKey]];
                } else {
                    // Handle boolean conversion
                    processedData[columnMapped] = typeof filteredBody[column] === "boolean"
                        ? Number(filteredBody[column]).toString()
                        : filteredBody[column];
                }
            }
        } catch (error) {
            const err = error as Error;
            logger.error(err)
            throw new CodedError(ErrorCode.INTERNAL_ERROR, "Error processing body data.");
        } finally {
            this.sql.end()
        }


        const columnNames = Object.keys(processedData);
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

        // TODO: Ensure plan exists on higher layer
        if (!body.Plan) {
            throw new CodedError(ErrorCode.ARGUMENT_ERROR, "Plan has to be in the request body")
        }
        const [planTableName, planProcessedData, planColumnNames] = await this.ProcessInsertData(Plan, body.Plan)
        try {

            const res = await this.sql.begin(async sql => {

                const [plan] = await sql<Plan[]>`
                    insert into ${sql(planTableName)} 
                    ${this.sql(planProcessedData, planColumnNames)}
                    returning *
                `

                const planModel = new Plan(plan)
                const machines = []
                const types = []
                if (!body.Plan) {
                    throw new CodedError(ErrorCode.DATABASE_ERROR, "fuck")
                }
                for (const machineInPlan of body.Plan.Machines) {
                    machineInPlan.PlanId = planModel.PlanId
                    const [mTableName, mProcessedData, mColumnNames] = await this.ProcessInsertData(MachinesInPlan, machineInPlan)
                    const [machine] = await sql<Model[]>`
                        insert into ${sql(mTableName)} 
                        ${this.sql(mProcessedData, mColumnNames)}
                        returning *
                    `
                    machines.push(new MachinesInPlan(machine))
                }

                planModel.Machines = machines

                const typePKey: string = Reflect.getMetadata(DecoratorType.PRIMARY_KEY, ExerciseCategory);
                for (const exType of body.Plan.ExerciseCategories) {
                    const [type] = await sql<Model[]>`
                        insert into ${sql("plan_category")} 
                        (${this.sql(typePKey)}, ${this.sql("plan_id")})
                        values (${exType.CategoryId}, ${planModel.PlanId})
                        returning *
                    `
                    types.push(new ExerciseCategory(type))
                }

                planModel.ExerciseCategories = types
                body.Plan = planModel

                const [resTableName, resProcessedData, resColumnNames] = await this.ProcessInsertData(Reservation, body)
                const [reservation] = await sql<Reservation[]>`
                    insert into ${sql(resTableName)} 
                    ${this.sql(resProcessedData, resColumnNames)}
                    returning *
                `
                return reservation
            })
            return new DatabaseCreated<Reservation>(res)
        } catch (error) {
            const err = error as Error;
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        }

    }
}

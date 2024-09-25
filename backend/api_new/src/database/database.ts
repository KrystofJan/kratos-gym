import postgres from 'postgres';
import "dotenv/config";
import { IDictionary } from '../utils';
import { DatabaseResponse, DatabaseFoundSingle, DatabaseFoundMultiple, DatabaseCreated } from './database-response';
import { Model } from '../endpoints/Model';
import { logger } from '../utils/logger';
import { DatabaseType, SimpleDatabaseType } from '../utils/utilities';
import { CodedError, ErrorCode } from '../errors/base.error';
import { DecoratorType } from './decorators/database-decorators';

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export class Database {

    public sql = postgres({
        host: PGHOST,
        database: PGDATABASE,
        username: PGUSER,
        password: PGPASSWORD,
        port: 5432,
        ssl: 'require',
        connection: {
            options: `project=${ENDPOINT_ID}`,
        },
    });

    constructor() {
    }

    async SelectAll<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        limit: number = 10,
        page: number = 0
    ): Promise<DatabaseFoundMultiple<T>> {

        const tableName = Reflect.getMetadata(DecoratorType.TABLE_NAME, modelType);
        if (limit < 0 || page < 0) {
            throw new CodedError(ErrorCode.ARGUMENT_ERROR, "Wrong page or limit value")
        }
        try {
            const offset: number = limit * page
            const result: T[] = await this.sql<T[]>`Select * from ${this.sql(tableName)} limit ${limit} offset ${offset}`;
            logger.info(`Select all from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`)
            return new DatabaseFoundMultiple<T>(result);
        } catch (error) {
            const err = error as Error;
            logger.error(err)
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        }
    }

    async SelectSpecific<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        id: number
    ): Promise<DatabaseFoundSingle<T>> {
        const tableName = Reflect.getMetadata(DecoratorType.TABLE_NAME, modelType);
        const pkey: string = Reflect.getMetadata(DecoratorType.PRIMARY_KEY, modelType);

        try {
            const [result]: T[] = await this.sql<T[]>`Select * from ${this.sql(tableName)} where ${this.sql(pkey)} = ${id}`;
            logger.info(`Select by id from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`)
            return new DatabaseFoundSingle<T>(result);
        } catch (error) {
            const err = error as Error;
            logger.error(err)
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)

        }
    }

    async SelectAttrIs<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        attrValue: SimpleDatabaseType,
        attrName: string
    ): Promise<DatabaseFoundSingle<T>> {
        const tableName = Reflect.getMetadata('tableName', modelType);

        try {
            const [result]: T[] = await this.sql<T[]>`Select * from ${this.sql(tableName)} where ${this.sql(attrName)} = ${attrValue}`;
            logger.info(`Select by attribute from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`)
            return new DatabaseFoundSingle<T>(result);
        } catch (error) {
            const err = error as Error;
            logger.error(err)
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        }
    }

    // TODO: Handle duplicates
    async Insert<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        body: T
    ): Promise<DatabaseCreated<T>> {
        const columnMap = Reflect.getMetadata(DecoratorType.COLUMN_MAP, modelType.prototype);
        const tableName = Reflect.getMetadata(DecoratorType.TABLE_NAME, modelType);
        const foreignKeyMap = Reflect.getMetadata(DecoratorType.FOREIGN_KEY_MAP, modelType.prototype);

        // Filter out null or undefined values from the body
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([_, value]) => value != null));
        const columns: string[] = Object.keys(filteredBody);

        const processedData: IDictionary<any> = {};

        try {
            for (const column of columns) {
                const columnMapped = columnMap[column];

                // Handle foreign key mapping
                if (foreignKeyMap?.[columnMapped]) {
                    const [_, fkPrototype] = foreignKeyMap[columnMapped];
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
            logger.error(err);
            throw new CodedError(ErrorCode.INTERNAL_ERROR, "Error processing body data.");
        }

        const columnNames = Object.keys(processedData);

        try {
            const [result] = await this.sql<T[]>`insert into ${this.sql(tableName)} ${this.sql(processedData, columnNames)} returning *`;
            logger.info(`Insert into ${tableName} was successful\n${JSON.stringify(result, null, 4)}`);
            return new DatabaseCreated<T>(result);
        } catch (error) {
            const err = error as Error;
            logger.error(err)
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        }
    }
}

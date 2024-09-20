import postgres from 'postgres';
import "dotenv/config";
import { IDictionary } from '../utils';
import { DatabaseResponse, DatabaseFoundSingle, DatabaseFail, DatabaseFoundMultiple, DatabaseCreated } from './database-response';
import { Model } from '../endpoints/Model';
import { logger } from '../utils/logger';

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

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
        console.log("dyyk more")
    }

    async SelectAll<T extends Model>(modelType: new (data: IDictionary<any>) => T, limit: number = 10, page: number = 0) {

        const tableName = Reflect.getMetadata('tableName', modelType);
        if (limit < 0 || page < 0) {
            throw new DatabaseFail(new Error("Wrong page or limit value "))
        }
        try {
            const offset: number = limit * page
            const result: T[] = await this.sql<T[]>`Select * from ${this.sql(tableName)} limit ${limit} offset ${offset}`;
            logger.info(`Select all from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`)
            return new DatabaseFoundMultiple(result);
        } catch (error) {
            logger.error(error)
            throw new DatabaseFail(error as Error)
        }
    }

    async SelectSpecific<T extends Model>(modelType: new (data: IDictionary<any>) => T, id: number, limit: number = 10, page: number = 0) {
        const tableName = Reflect.getMetadata('tableName', modelType);
        let pkey: string = Reflect.getMetadata('primaryKey', modelType);

        try {
            const [result]: T[] = await this.sql<T[]>`Select * from ${this.sql(tableName)} where ${this.sql(pkey)} = ${id}`;
            logger.info(`Select by id from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`)
            return new DatabaseFoundSingle(result);
        } catch (error) {
            logger.error(error)
            throw new DatabaseFail(error as Error)
        }
    }

    async SelectAttrIs(attrValue: any, attrName: string, tableName: string): Promise<DatabaseResponse> {
        try {
            const [result]: Model[] = await this.sql<Model[]>`Select * from ${this.sql(tableName)} where ${this.sql(attrName)} = ${attrValue}`;
            logger.info(`Select by attribute from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`)
            return new DatabaseFoundSingle(result);
        } catch (error) {
            logger.error(error)
            throw new DatabaseFail(error as Error)
        }
    }

    // TODO: Handle duplicates
    async Insert<T extends Model>(modelType: new (data: IDictionary<any>) => T, body: IDictionary<any>): Promise<DatabaseResponse> {
        const columnMap = Reflect.getMetadata('columnMap', modelType.prototype);
        const tableName = Reflect.getMetadata('tableName', modelType);
        const foreignKeyMap = Reflect.getMetadata("foreignKeyMap", modelType.prototype);

        // Filter out null or undefined values from the body
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([_, value]) => value != null));
        const columns: string[] = Object.keys(filteredBody);

        logger.info(body)
        let processedData: IDictionary<any> = {};

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
            logger.error(error);
            throw new Error("Error processing body data.");
        }

        const columnNames = Object.keys(processedData);

        try {
            const [result] = await this.sql<T[]>`insert into ${this.sql(tableName)} ${this.sql(processedData, columnNames)} returning *`;
            logger.info(`Insert into ${tableName} was successful\n${JSON.stringify(result, null, 4)}`);
            return new DatabaseCreated(result);
        } catch (error) {
            logger.error(error);
            throw new DatabaseFail(error as Error);
        }
    }
}

import 'dotenv/config'
import { IDictionary } from '../utils'
import {
    DatabaseDeleted,
    DatabaseFoundSingle,
    DatabaseFoundMultiple,
    DatabaseCreated,
} from './database-response'
import { Model } from '../endpoints/base'
import { logger } from '../utils/logger'
import { DatabaseType, SimpleDatabaseType } from '../utils/utilities'
import { CodedError, ErrorCode } from '../errors/base.error'
import { DecoratorType } from './decorators/database-decorators'
import { Database } from './database'

export class BasicQueryDatabase extends Database {
    constructor() {
        super()
    }

    async SelectAll<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        limit: number = 10,
        page: number = 0
    ): Promise<DatabaseFoundMultiple<T>> {
        const tableName = Reflect.getMetadata(
            DecoratorType.TABLE_NAME,
            modelType
        )
        if (limit < 0 || page < 0) {
            throw new CodedError(
                ErrorCode.ARGUMENT_ERROR,
                'Wrong page or limit value'
            )
        }
        try {
            const offset: number = limit * page
            const result: T[] = await this.sql<T[]>`
                Select * 
                from ${this.sql(tableName)} 
                limit ${limit}
                offset ${offset}
            `
            logger.info(
                `Select all from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundMultiple<T>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async SelectSpecific<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        id: number
    ): Promise<DatabaseFoundSingle<T>> {
        const tableName = Reflect.getMetadata(
            DecoratorType.TABLE_NAME,
            modelType
        )
        const pkey: string = Reflect.getMetadata(
            DecoratorType.PRIMARY_KEY,
            modelType
        )

        try {
            const [result]: T[] = await this.sql<T[]>`
                Select * from ${this.sql(tableName)}
                where ${this.sql(pkey)} = ${id}
            `
            logger.info(
                `Select by id from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundSingle<T>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async SelectAttrIs<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        attrValue: SimpleDatabaseType,
        attrName: string
    ): Promise<DatabaseFoundSingle<T> | DatabaseFoundMultiple<T>> {
        const tableName = Reflect.getMetadata('tableName', modelType)

        try {
            logger.info(
                `Select * from ${tableName} where ${attrName} = ${attrValue}`
            )
            const result: T[] = await this.sql<T[]>`
                Select * from ${this.sql(tableName)}
                where ${this.sql(attrName)} = ${attrValue}
            `
            logger.info(
                `Select by attribute from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`
            )
            if (result.length > 1) {
                return new DatabaseFoundMultiple<T>(result)
            }
            return new DatabaseFoundSingle<T>(result[0])
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async SelectOnForeignTable<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        foreignType: string,
        idKey: string,
        idValue: number
    ): Promise<DatabaseFoundMultiple<T>> {
        const tableName = Reflect.getMetadata('tableName', modelType)
        const pkey: string = Reflect.getMetadata(
            DecoratorType.PRIMARY_KEY,
            modelType
        )

        try {
            const result: T[] = await this.sql<T[]>`
                Select ${this.sql(tableName)}.* 
                from ${this.sql(tableName)} inner join ${this.sql(foreignType)} 
                on ${this.sql(tableName)}.${this.sql(pkey)}= ${this.sql(foreignType)}.${this.sql(pkey)}
                where ${this.sql(idKey)} = ${idValue}
            `
            logger.info(
                `Select by attribute from ${tableName} table was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseFoundMultiple<T>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async InsertManyToMany<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        id: number,
        foreignType: string,
        idKey: string,
        idValue: number
    ): Promise<DatabaseCreated<T>> {
        const pkey: string = Reflect.getMetadata(
            DecoratorType.PRIMARY_KEY,
            modelType
        )
        try {
            const [result] = await this.sql<T[]>`
                insert into ${this.sql(foreignType)} 
                    (${this.sql(pkey)}, ${this.sql(idKey)})
                values (${id}, ${idValue})
                returning *
            `
            logger.info(
                `Insert into ${foreignType} was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseCreated<T>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async Insert<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        body: T
    ): Promise<DatabaseCreated<T>> {
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
                    processedData[columnMapped] =
                        typeof filteredBody[column] === 'boolean'
                            ? Number(filteredBody[column]).toString()
                            : filteredBody[column]
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

        try {
            const [result] = await this.sql<T[]>`
                insert into ${this.sql(tableName)} 
                ${this.sql(processedData, columnNames)}
                returning *
            `
            logger.info(
                `Insert into ${tableName} was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseCreated<T>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async Update<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        id: number,
        body: Partial<T>,
        otherIdKey?: string,
        otherIdValue?: number
    ): Promise<DatabaseCreated<T>> {
        const columnMap = Reflect.getMetadata(
            DecoratorType.COLUMN_MAP,
            modelType.prototype
        )
        const tableName = Reflect.getMetadata(
            DecoratorType.TABLE_NAME,
            modelType
        )
        const pkey: string = Reflect.getMetadata(
            DecoratorType.PRIMARY_KEY,
            modelType
        )
        const fkToPkMap = Reflect.getMetadata(
            DecoratorType.FOREIGN_PRIMARY_KEY_MAP,
            modelType.prototype
        )
        const unInsertables = Reflect.getMetadata(
            DecoratorType.UNINSERTABLE,
            modelType.prototype
        )
        const unUpdatables = Reflect.getMetadata(
            DecoratorType.UNUPDATABLE,
            modelType.prototype
        )

        const filteredBody = Object.fromEntries(
            Object.entries(body).filter(([, value]) => value != null)
        )

        const processedData: IDictionary<SimpleDatabaseType> = {}

        try {
            for (const [key, value] of Object.entries(filteredBody)) {
                if (
                    unInsertables?.includes(key) ||
                    unUpdatables?.includes(key)
                ) {
                    continue
                }
                let k = columnMap[key]
                if (fkToPkMap && Object.keys(fkToPkMap).includes(key)) {
                    k = fkToPkMap[key]
                    processedData[k] = value
                }
                const columnMapped = k
                processedData[columnMapped] = value
            }
        } catch (error) {
            const err = error as Error
            logger.error(err)
            throw new CodedError(
                ErrorCode.INTERNAL_ERROR,
                'Error processing body data.'
            )
        }

        try {
            const [result] = await this.sql<T[]>`
                UPDATE ${this.sql(tableName)}
                SET ${this.sql(processedData)}
                WHERE ${this.sql(pkey)} = ${id}
                ${otherIdKey && otherIdValue ? this.sql`AND ${this.sql(otherIdKey)} = ${otherIdValue}` : this.sql``}
                RETURNING *
            `
            logger.info(
                `Update in ${tableName} was successful\n${JSON.stringify(result, null, 4)}`
            )
            return new DatabaseCreated<T>(result)
        } catch (error) {
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async Delete<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        id: number
    ): Promise<DatabaseDeleted> {
        const tableName = Reflect.getMetadata(
            DecoratorType.TABLE_NAME,
            modelType
        )
        const pkey: string = Reflect.getMetadata(
            DecoratorType.PRIMARY_KEY,
            modelType
        )

        try {
            const result = await this.sql`
                DELETE FROM ${this.sql(tableName)}
                WHERE ${this.sql(pkey)} = ${id}
            `
            logger.info(
                `Delete from ${tableName} was successful. Rows affected: ${result.count}`
            )

            if (!result.count) {
                throw new CodedError(
                    ErrorCode.NOT_FOUND_ERROR,
                    `Cannot find a record with ${id} id`
                )
            }
            return new DatabaseDeleted(id)
        } catch (error) {
            if (error instanceof CodedError) {
                throw error
            }
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }

    async DeleteManyToMany<T extends Model>(
        modelType: new (data: IDictionary<DatabaseType>) => T,
        id: number,
        foreignType: string,
        idKey: string,
        idValue: number
    ): Promise<DatabaseDeleted> {
        const tableName = Reflect.getMetadata(
            DecoratorType.TABLE_NAME,
            modelType
        )
        const pkey: string = Reflect.getMetadata(
            DecoratorType.PRIMARY_KEY,
            modelType
        )

        try {
            const result = await this.sql`
                DELETE FROM ${this.sql(foreignType)}
                WHERE ${this.sql(pkey)} = ${id} AND ${this.sql(idKey)} = ${idValue}
            `
            logger.info(
                `Delete from ${tableName} was successful. Rows affected: ${result.count}`
            )

            if (!result.count) {
                throw new CodedError(
                    ErrorCode.NOT_FOUND_ERROR,
                    `Cannot find a record with ${id} id`
                )
            }
            return new DatabaseDeleted(id)
        } catch (error) {
            if (error instanceof CodedError) {
                throw error
            }
            const err = error as Error
            throw new CodedError(ErrorCode.DATABASE_ERROR, err?.message)
        } finally {
            this.sql.end()
        }
    }
}

import { Model } from '../endpoints/base';
import { DatabaseType, IDictionary } from '../utils/utilities';
import { DecoratorType } from './decorators/database-decorators';
import 'reflect-metadata'; // Assuming Reflect metadata is used for decorators

export class SelectQuery<T extends Model> {
    protected selectedParams: string[] = [];
    protected fromTable: string = '';
    protected whereConditions: string[] = [];
    // protected joinClauses: string[] = [];
    protected orderByClause: string = '';
    protected limitValue: number | null = null;
    protected offsetValue: number | null = null;
    protected modelClass: new (data: IDictionary<DatabaseType>) => T
    constructor(
        modelClass: new (data: IDictionary<DatabaseType>) => T,
    ) {
        this.modelClass = modelClass;
        this.fromTable = Reflect.getMetadata('tableName', modelClass);
    }

    Params(...params: (keyof T)[]): this {
        const colMap = Reflect.getMetadata(DecoratorType.COLUMN_MAP, this.modelClass.prototype);
        this.selectedParams = params.map(p => `${this.fromTable}.${colMap[p]}`);
        return this;
    }

    Where(condition: { [K in keyof T]?: [string, any] }): this {
        const colMap = Reflect.getMetadata(DecoratorType.COLUMN_MAP, this.modelClass.prototype);
        for (const [key, [operator, value]] of Object.entries(condition)) {
            this.whereConditions.push(`${this.fromTable}.${(colMap[key])} ${operator} ${value}`);
        }
        return this;
    }

    // InnerJoin<U extends Model>(joinModelClass: new () => U): JoinQuery<T, U> {
    //     return new JoinQuery<T, U>(this, joinModelClass);
    // }

    OrderBy(param: keyof T, direction: 'asc' | 'desc'): this {
        this.orderByClause = `ORDER BY ${this.fromTable}.${String(param)} ${direction.toUpperCase()}`;
        return this;
    }

    Limit(limit: number): this {
        this.limitValue = limit;
        return this;
    }

    Offset(offset: number): this {
        this.offsetValue = offset;
        return this;
    }

    toSQL(): string {
        let sql = `SELECT ${this.selectedParams.join(', ')} FROM ${this.fromTable}`;

        // if (this.joinClauses.length > 0) {
        //     sql += ' ' + this.joinClauses.join(' ');
        // }

        if (this.whereConditions.length > 0) {
            sql += ` WHERE ${this.whereConditions.join(' AND ')}`;
        }

        if (this.orderByClause) {
            sql += ' ' + this.orderByClause;
        }

        if (this.limitValue !== null) {
            sql += ` LIMIT ${this.limitValue}`;
        }

        if (this.offsetValue !== null) {
            sql += ` OFFSET ${this.offsetValue}`;
        }

        return sql;
    }
}

// class JoinQuery<T extends Model, U extends Model> extends SelectQuery<T> {
//     private parentQuery: SelectQuery<T>;
//     private joinTable: string = '';
//     private joinModelClass: new () => U;
//
//     constructor(parentQuery: SelectQuery<T>, joinModelClass: new () => U) {
//         super(parentQuery.modelClass);
//         this.parentQuery = parentQuery;
//         this.joinModelClass = joinModelClass;
//         this.joinTable = Reflect.getMetadata('tableName', joinModelClass);
//     }
//
//     On<K extends keyof T, J extends keyof U>(
//         tableField: K,
//         joinField: J
//     ): SelectQuery<T> {
//         const tableName = Reflect.getMetadata('tableName', this.modelClass);
//         const joinTableName = this.joinTable;
//
//         const joinClause = `INNER JOIN ${joinTableName} ON ${tableName}.${String(tableField)} = ${joinTableName}.${String(joinField)}`;
//         this.parentQuery.joinClauses.push(joinClause);
//
//         return this.parentQuery;
//     }
//
//     Params(...params: (keyof U)[]): this {
//         const joinParams = params.map(p => `${this.joinTable}.${String(p)}`);
//         this.parentQuery.selectedParams.push(...joinParams);
//         return this;
//     }
// }


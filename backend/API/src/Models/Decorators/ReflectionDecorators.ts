import 'reflect-metadata';
import { ColumnOptions } from '../../utils/Utilities.js'

const TABLE_KEY = Symbol("table");
const COLUMN_KEY = Symbol("column");


export function Table(tableName: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(TABLE_KEY, tableName, target);
    };
}

export function Column(opts: ColumnOptions): PropertyDecorator {
    return (target, propertyKey) => {
        const columns = Reflect.getMetadata(COLUMN_KEY, target.constructor) || {};
        columns[propertyKey] = opts;
        Reflect.defineMetadata(COLUMN_KEY, columns, target.constructor);
    };
}

export function getEntityMetadata(target: any): string {
    return Reflect.getMetadata(COLUMN_KEY, target);
}

export function getColumnMetadata(target: any): Record<string, string> {
    return Reflect.getMetadata(COLUMN_KEY, target) || {};
}

import 'reflect-metadata';
var TABLE_KEY = Symbol("table");
var COLUMN_KEY = Symbol("column");
export function Table(tableName) {
    return function (target) {
        Reflect.defineMetadata(TABLE_KEY, tableName, target);
    };
}
export function Column(opts) {
    return function (target, propertyKey) {
        var columns = Reflect.getMetadata(COLUMN_KEY, target.constructor) || {};
        columns[propertyKey] = opts;
        Reflect.defineMetadata(COLUMN_KEY, columns, target.constructor);
    };
}
export function getEntityMetadata(target) {
    return Reflect.getMetadata(COLUMN_KEY, target);
}
export function getColumnMetadata(target) {
    return Reflect.getMetadata(COLUMN_KEY, target) || {};
}

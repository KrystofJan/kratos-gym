import 'reflect-metadata';
import { Model } from '../../endpoints/Model';

export enum DecoratorType {
    TABLE_NAME = "tableName",
    COLUMN_NAME = "columnName",
    COLUMN_MAP = "columnMap",
    FIELD_MAP = "fieldMap",
    FOREIGN_KEY_MAP = "foreignKeyMap",
    FOREIGN_KEYS = "foreignKeys",
    PRIMARY_KEY = "primaryKey",
    UNINSERTABLE = "uninsertable"
}

export function Table(tableName: string) {
    return function(constructor: Function) {
        Reflect.defineMetadata(DecoratorType.TABLE_NAME, tableName, constructor);
    };
}

export function Column(name: string) {
    return function(target: Model, propertyKey: string) {
        const columns = Reflect.getMetadata(DecoratorType.COLUMN_NAME, target) || [];
        columns.push(name);
        Reflect.defineMetadata(DecoratorType.COLUMN_NAME, columns, target);

        // NOTE: Map for this format -> {"PlanName": "plan_name"}
        const columnMap = Reflect.getMetadata(DecoratorType.COLUMN_MAP, target) || {};
        columnMap[propertyKey] = name;
        Reflect.defineMetadata(DecoratorType.COLUMN_MAP, columnMap, target);

        // NOTE: Map for this format -> {"plan_name": "PlanName"}
        const fieldMap = Reflect.getMetadata(DecoratorType.FIELD_MAP, target) || {};

        fieldMap[name] = propertyKey;
        Reflect.defineMetadata(DecoratorType.FIELD_MAP, fieldMap, target);
    };
}

export function ForeignKey(type: any) {
    return function(target: Model, propertyKey: string) {
        const fkMap = Reflect.getMetadata(DecoratorType.FOREIGN_KEY_MAP, target) || {};
        const columnName = Reflect.getMetadata(DecoratorType.COLUMN_NAME, target) || [];
        fkMap[columnName[propertyKey]] = [propertyKey, type]
        Reflect.defineMetadata(DecoratorType.FOREIGN_KEY_MAP, fkMap, target);


        const columns = Reflect.getMetadata(DecoratorType.FOREIGN_KEYS, target) || [];
        columns.push(propertyKey);
        Reflect.defineMetadata(DecoratorType.FOREIGN_KEYS, columns, target);
    }
}

export function PrimaryKey(tableName: string) {
    return function(constructor: Function) {
        Reflect.defineMetadata(DecoratorType.PRIMARY_KEY, tableName, constructor);
    };
}

export function UnInsertable() {
    return function(target: Model, propertyKey: string) {
        const unInsertable = Reflect.getMetadata(DecoratorType.UNINSERTABLE, target) || [];
        unInsertable.push(propertyKey);
        Reflect.defineMetadata(DecoratorType.UNINSERTABLE, unInsertable, target);
    }
}

export function Optional() {
}

export function getMetadataForProperties(target: Model) {
    // Create a temporary instance of the class
    const metadata: { [key: string]: string } = {};
    const instanceFields = Object.keys(target)//instance);

    instanceFields.forEach(field => {
        const columnName = Reflect.getMetadata(DecoratorType.COLUMN_NAME, target, field);
        if (columnName) {
            metadata[field] = columnName;
        }
    })

    return metadata;
}

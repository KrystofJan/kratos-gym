import 'reflect-metadata';
import { Model } from '../../endpoints/base';

export enum DecoratorType {
    TABLE_NAME = "tableName",
    COLUMN_NAME = "columnName",
    COLUMN_MAP = "columnMap",
    FIELD_MAP = "fieldMap",
    FOREIGN_KEY_MAP = "foreignKeyMap",
    FOREIGN_KEYS = "foreignKeys",
    PRIMARY_KEY = "primaryKey",
    UNINSERTABLE = "uninsertable",
    UNUPDATABLE = "unupdatable",
    FOREIGN_PRIMARY_KEY_MAP = "fkToPkMap",
    FOREIGN_PRIMARY_OBJECT_KEY_MAP = "foToPkMap",
    FOREIGN_KEYS_KEYS = "fkk",
    DIFERENTLY_NAMED_FOREIGN_KEYS = "differentFks",
    MANY_TO_MANY = "m2m"
}

interface ManyToManyData {
    key: string,
    refersTo: unknown,
    tableName: string
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
        const columnMap = Reflect.getMetadata(DecoratorType.COLUMN_MAP, target) || [];
        fkMap[columnMap[propertyKey]] = [propertyKey, type]
        Reflect.defineMetadata(DecoratorType.FOREIGN_KEY_MAP, fkMap, target);
        //
        // collection of foreign keys
        const columns = Reflect.getMetadata(DecoratorType.FOREIGN_KEYS, target) || [];
        columns.push(propertyKey);
        Reflect.defineMetadata(DecoratorType.FOREIGN_KEYS, columns, target);

        // {"AddressId" : "address_id"}

        console.log(type, propertyKey)
        const fieldMap = Reflect.getMetadata(DecoratorType.FIELD_MAP, type.prototype) || {};
        const foreignKey = Reflect.getMetadata('primaryKey', type);
        const foreignPrimaryKey = Reflect.getMetadata(DecoratorType.FOREIGN_PRIMARY_KEY_MAP, target) || {};
        foreignPrimaryKey[fieldMap[foreignKey]] = foreignKey
        Reflect.defineMetadata(DecoratorType.FOREIGN_PRIMARY_KEY_MAP, foreignPrimaryKey, target);

        // ["AddressId", "AccountId"]
        const foreignKeyString = Reflect.getMetadata(DecoratorType.FOREIGN_KEYS_KEYS, target) || [];
        foreignKeyString.push(fieldMap[foreignKey])
        Reflect.defineMetadata(DecoratorType.FOREIGN_KEYS_KEYS, foreignKeyString, target);

        // "Address": "AddressId"
        const foreignObjectMap = Reflect.getMetadata(DecoratorType.FOREIGN_PRIMARY_OBJECT_KEY_MAP, target) || {};
        foreignObjectMap[propertyKey] = fieldMap[foreignKey]
        Reflect.defineMetadata(DecoratorType.FOREIGN_PRIMARY_OBJECT_KEY_MAP, foreignObjectMap, target);

        // fk map of pks -> 
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


export function DifferentlyNamedForeignKey(name: string) {
    return function(target: Model, propertyKey: string) {
        const differentlyNamedFks = Reflect.getMetadata(DecoratorType.DIFERENTLY_NAMED_FOREIGN_KEYS, target) || [];
        differentlyNamedFks.push(propertyKey);
        differentlyNamedFks.push(name);
        Reflect.defineMetadata(DecoratorType.DIFERENTLY_NAMED_FOREIGN_KEYS, differentlyNamedFks, target);
    }
}


export function UnUpdatable() {
    return function(target: Model, propertyKey: string) {
        const unInsertable = Reflect.getMetadata(DecoratorType.UNUPDATABLE, target) || [];
        unInsertable.push(propertyKey);
        Reflect.defineMetadata(DecoratorType.UNUPDATABLE, unInsertable, target);
    }
}

export function Optional() {
}

export function ManyToMany(type: unknown, table: string) {
    return function(target: Model, propertyKey: string) {
        const data: ManyToManyData = {
            key: propertyKey,
            refersTo: type,
            tableName: table
        }

        const m2m = Reflect.getMetadata(DecoratorType.MANY_TO_MANY, target) || [];
        m2m[propertyKey] = data
        Reflect.defineMetadata(DecoratorType.MANY_TO_MANY, m2m, target);
    }
}

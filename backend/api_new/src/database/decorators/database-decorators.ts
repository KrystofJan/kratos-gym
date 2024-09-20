import 'reflect-metadata';

export function Table(tableName: string) {
    return function(constructor: Function) {
        Reflect.defineMetadata('tableName', tableName, constructor);
    };
}

export function Column(name: string) {
    return function(target: any, propertyKey: string) {
        const columns = Reflect.getMetadata('columnName', target) || [];
        columns.push(name);
        Reflect.defineMetadata('columnName', columns, target);

        // NOTE: Map for this format -> {"PlanName": "plan_name"}
        const columnMap = Reflect.getMetadata('columnMap', target) || {};
        columnMap[propertyKey] = name;
        Reflect.defineMetadata('columnMap', columnMap, target);

        // NOTE: Map for this format -> {"plan_name": "PlanName"}
        const fieldMap = Reflect.getMetadata('fieldMap', target) || {}

        fieldMap[name] = propertyKey;
        Reflect.defineMetadata('fieldMap', fieldMap, target);

    };
}

export function ForeignKey(type: any) {
    return function(target: any, propertyKey: string) {
        const fkMap = Reflect.getMetadata('foreignKeyMap', target) || {};
        const columnName = Reflect.getMetadata('columnMap', target)
        fkMap[columnName[propertyKey]] = [propertyKey, type]
        Reflect.defineMetadata('foreignKeyMap', fkMap, target)
    }
}

export function PrimaryKey(tableName: string) {
    return function(constructor: Function) {
        Reflect.defineMetadata('primaryKey', tableName, constructor);
    };
}

export function getMetadataForProperties(target: any) {
    // Create a temporary instance of the class
    const metadata: { [key: string]: string } = {};
    const instanceFields = Object.keys(target)//instance);

    instanceFields.forEach(field => {
        const columnName = Reflect.getMetadata('columnName', target, field);
        if (columnName) {
            metadata[field] = columnName;
        }
    })

    return metadata;
}

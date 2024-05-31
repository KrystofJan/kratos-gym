import "reflect-metadata";

const PRIMARY_ID_METRADATA_KEY = Symbol('primaryIdentifier');
const FOREIGN_ID_METRADATA_KEY = Symbol('foreignIdentifier');

export function PrimaryIdentifier(): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(PRIMARY_ID_METRADATA_KEY, true, target, propertyKey);
    }
}

export function ForeignIdentifier(keyName: string) {
    return (target: Object, propertyKey: string | symbol) => {
        Reflect.defineMetadata(PRIMARY_ID_METRADATA_KEY, keyName, target, propertyKey);
    }
}

export function isPrimaryIdentifier(target: Object, propertyKey: string | symbol): boolean {
    return Reflect.getMetadata(PRIMARY_ID_METRADATA_KEY, target, propertyKey) === true;
}

export function isForeignIdentifier(target: Object, propertyKey: string | symbol): boolean {
    return Reflect.getMetadata(FOREIGN_ID_METRADATA_KEY, target, propertyKey) !== undefined;
}

export function getForeignIdentifierKey(target: Object, propertyKey: string | symbol): string | undefined {
    return Reflect.getMetadata(FOREIGN_ID_METRADATA_KEY, target, propertyKey);
}

import "reflect-metadata";
var PRIMARY_ID_METRADATA_KEY = Symbol('primaryIdentifier');
var FOREIGN_ID_METRADATA_KEY = Symbol('foreignIdentifier');
export function PrimaryIdentifier() {
    return function (target, propertyKey) {
        Reflect.defineMetadata(PRIMARY_ID_METRADATA_KEY, true, target, propertyKey);
    };
}
export function ForeignIdentifier(keyName) {
    return function (target, propertyKey) {
        Reflect.defineMetadata(PRIMARY_ID_METRADATA_KEY, keyName, target, propertyKey);
    };
}
export function isPrimaryIdentifier(target, propertyKey) {
    return Reflect.getMetadata(PRIMARY_ID_METRADATA_KEY, target, propertyKey) === true;
}
export function isForeignIdentifier(target, propertyKey) {
    return Reflect.getMetadata(FOREIGN_ID_METRADATA_KEY, target, propertyKey) !== undefined;
}
export function getForeignIdentifierKey(target, propertyKey) {
    return Reflect.getMetadata(FOREIGN_ID_METRADATA_KEY, target, propertyKey);
}

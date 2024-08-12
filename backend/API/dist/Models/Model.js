import { getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
export class Model {
    cosntructor() {
    }
    constructJson() {
        return JSON.parse(JSON.stringify(this));
    }
    // TODO
    validateAttrs() {
        for (const prop in this) {
            if (this[prop] === undefined) {
                return false;
            }
        }
        return true;
    }
    getKeysDictionary() {
        return getMetadataForProperties(this);
    }
}

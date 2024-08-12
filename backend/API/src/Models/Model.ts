import { IDictionary } from "../utils/Utilities.js";

export class Model {

    cosntructor() {
    }

    constructJson(): IDictionary<any> {
        return JSON.parse(JSON.stringify(this));
    }

    // TODO
    validateAttrs(): boolean {
        for (const prop in this) {
            if (this[prop] === undefined) {
                return false;
            }
        }
        return true;
    }
}

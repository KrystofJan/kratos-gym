import { IDictionary } from "../utils";
import { getMetadataForProperties } from "../database";
import { DatabaseType } from "../utils/utilities";

export class Model {

    cosntructor() {
    }

    constructJson(): IDictionary<DatabaseType> {
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

    getKeysDictionary() {
        return getMetadataForProperties(this)
    }
}

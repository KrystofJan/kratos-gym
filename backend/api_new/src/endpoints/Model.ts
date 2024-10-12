import { IDictionary, logger } from "../utils";
import { DatabaseType } from "../utils/utilities";


export class Model {

    cosntructor() {
    }

    constructJson(): IDictionary<DatabaseType> {
        return JSON.parse(JSON.stringify(this));
    }

    validateAttrs(): boolean {
        // TODO the 
        // for (const prop of Object.keys(this) as Array<keyof this>) {
        //     if (this[prop] === undefined) {
        //         return false;
        //     }
        // }
        return true;
    }

    checkForUnneededData(json: IDictionary<DatabaseType>) {
        const thisProps = Object.keys(this)
        for (const prop of Object.keys(json)) {
            if (!thisProps.includes(prop)) {
                return false;
            }
        }
        return true;
    }

}

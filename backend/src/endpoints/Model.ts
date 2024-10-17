import { DecoratorType } from "../database/decorators/database-decorators";
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
        const foreignKeys = Reflect.getMetadata(DecoratorType.FOREIGN_KEYS_KEYS, Object.getPrototypeOf(this));
        const differentlyNamedForeignKeys = Reflect.getMetadata(DecoratorType.DIFERENTLY_NAMED_FOREIGN_KEYS, Object.getPrototypeOf(this));
        for (const prop of Object.keys(json)) {
            if (!thisProps.includes(prop) &&
                !foreignKeys.includes(prop) &&
                !differentlyNamedForeignKeys.includes(prop)
            ) {
                logger.warn(prop)
                return false;
            }
        }
        return true;
    }

}

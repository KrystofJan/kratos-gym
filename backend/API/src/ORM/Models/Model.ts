import { IDictionary } from "../../utils/Utilities.js";

export class Model {

    cosntructor() {
    }

    constructJson(): IDictionary<any> {
        return  JSON.parse(JSON.stringify(this));
    }

    validateAttrs(): boolean {
        return true;
    }
}

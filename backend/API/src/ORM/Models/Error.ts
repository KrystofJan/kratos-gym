import { IDictionary } from "../../utils/Utilities.js";
import { Model } from './Model.js'

export class Error extends Model {

    err: IDictionary<any>;
    
    constructor(err: IDictionary<any>) {
        super();
        this.err = err;
    }
}

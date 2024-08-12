import { Model } from './Model.js';
export class Error extends Model {
    constructor(err) {
        super();
        this.err = err;
    }
}

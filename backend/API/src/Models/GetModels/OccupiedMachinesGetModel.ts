import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

@Table("")
export class OccupiedMachinesGetModel extends Model {
    @Column({ type: "number", columnName: "count" })
    public count: number;

    constructor(body: IDictionary<number>) {
        super();
        this.count = body.count;
    }
}

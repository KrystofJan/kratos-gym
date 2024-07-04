import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

@Table("WrkOutMachine")
export class WrkOutMachinePostModel extends Model {
    @Column({ type: "string", columnName: "MachineName" })
    public MachineName: string;

    @Column({ type: "number", columnName: "MaxWeight" })
    public MaxWeight: number;

    @Column({ type: "number", columnName: "MinWeight" })
    public MinWeight: number;

    @Column({ type: "number", columnName: "MaxPeople" })
    public MaxPeople: number;

    @Column({ type: "number", columnName: "AvgTimeTaken" })
    public AvgTimeTaken: number;

    @Column({ type: "number", columnName: "PopularityScore" })
    public PopularityScore: number;


    constructor(jsonData: IDictionary<any>) {
        super();
        this.MachineName = jsonData.MachineName;
        this.MaxWeight = jsonData.MaxWeight;
        this.MinWeight = jsonData.MinWeight;
        this.MaxPeople = jsonData.MaxPeople;
        this.AvgTimeTaken = jsonData.AvgTimeTaken;
        this.PopularityScore = jsonData.PopularityScore;
    }
}

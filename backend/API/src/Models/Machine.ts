import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Column, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("machine")
@PrimaryKey("machine_id")

export class Machine extends Model {
    @Column("machine_id")
    public MachineId: number | null;
    @Column("machine_name")
    public MachineName: string;
    @Column("max_weight")
    public MaxWeight: number;
    @Column("min_weight")
    public MinWeight: number;
    @Column("max_people")
    public MaxPeople: number;
    @Column("avg_time_taken")
    public AvgTimeTaken: number;
    @Column("popularity_score")
    public PopularityScore: number;

    constructor(jsonData: IDictionary<any>) {
        super();

        const databaseNames = getMetadataForProperties(Machine);
        this.MachineId = jsonData[databaseNames["MachineId"]] ?? null;
        this.MachineName = jsonData[databaseNames["MachineName"]];
        this.MaxWeight = jsonData[databaseNames["MaxWeight"]] ?? 0;
        this.MinWeight = jsonData[databaseNames["MinWeight"]] ?? 0;
        this.MaxPeople = jsonData[databaseNames["MaxPeople"]];
        this.AvgTimeTaken = jsonData[databaseNames["AvgTimeTaken"]];
        this.PopularityScore = jsonData[databaseNames["PopularityScore"]] ?? 0;
    }
}

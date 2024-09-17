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

        this.MachineId = jsonData["MachineId"] ?? jsonData["machine_id"];
        this.MachineName = jsonData["MachineName"] ?? jsonData["machine_name"];
        this.MaxWeight = jsonData["MaxWeight"] ?? jsonData["max_weight"];
        this.MinWeight = jsonData["MinWeight"] ?? jsonData["min_weight"];
        this.MaxPeople = jsonData["MaxPeople"] ?? jsonData["max_people"];
        this.AvgTimeTaken = jsonData["AvgTimeTaken"] ?? jsonData["avg_time_taken"];
        this.PopularityScore = jsonData["PopularityScore"] ?? jsonData["popularity_score"];
    }
}

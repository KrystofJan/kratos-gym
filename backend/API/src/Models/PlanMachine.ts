import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Machine } from "./Machine.js";
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("plan_machine")
@PrimaryKey("plan_id")

export class PlanMachine extends Model {
    @Column("plan_id")
    public PlanId: number;

    @ForeignKey(Machine)
    @Column("machine_id")
    public Machine: Machine | null;
    @Column("sets")
    public Sets: number;

    @Column("reps")
    public Reps: number;
    @Column("start_time")
    public StartTime: Date;
    @Column("end_time")
    public EndTime: Date;
    @Column("can_disturb")
    public CanDisturb: boolean;


    constructor(jsonData: IDictionary<any>) {
        super();

        const databaseNames = getMetadataForProperties(PlanMachine);
        this.PlanId = jsonData[databaseNames["PlanId"]];
        this.Sets = jsonData[databaseNames["Sets"]];
        this.Reps = jsonData[databaseNames["Reps"]];
        this.StartTime = jsonData[databaseNames["StartTime"]];
        this.EndTime = jsonData[databaseNames["EndTime"]];
        this.CanDisturb = jsonData[databaseNames["CanDisturb"]];
        this.Machine = jsonData[databaseNames["Machine"]] ?? null;
    }
}

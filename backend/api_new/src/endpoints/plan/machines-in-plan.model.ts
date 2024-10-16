import { IDictionary } from '../../utils';
import { Model } from '../Model';
import { Column, UnUpdatable, Table, PrimaryKey } from "../../database";

@Table("plan_machine")
@PrimaryKey("plan_id")
export class MachinesInPlan extends Model {
    @UnUpdatable()
    @Column("plan_id")
    public PlanId: number;

    @UnUpdatable()
    @Column("machine_id")
    public MachineId: number;

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
        this.PlanId = jsonData["PlanId"] ?? jsonData["plan_id"]
        this.MachineId = jsonData["MachineId"] ?? jsonData["machine_id"]
        this.Sets = jsonData["Sets"] ?? jsonData["sets"]
        this.Reps = jsonData["Reps"] ?? jsonData["reps"]
        this.StartTime = jsonData["StartTime"] ?? jsonData["start_time"]
        this.EndTime = jsonData["EndTime"] ?? jsonData["end_time"]
        this.CanDisturb = jsonData["CanDisturb"] ?? jsonData["can_disturb"]

    }
}

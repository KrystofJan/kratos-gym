import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class PlanMachinePostModel extends Model {
    public wrkoutmachine_id: number;
    public wrkoutplan_id: number;
    public sets: number;
    public reps: number;
    public start_time: Date;
    public end_time: Date;
    public can_disturb: boolean;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.wrkoutmachine_id = jsonData.MachineId;
        this.wrkoutplan_id = jsonData.Pland;
        this.sets = jsonData.Sets;
        this.reps = jsonData.Reps;
        this.start_time = jsonData.StartTime;
        this.end_time = jsonData.EndTime;
        this.can_disturb = jsonData.CanDisturb;
    }
}

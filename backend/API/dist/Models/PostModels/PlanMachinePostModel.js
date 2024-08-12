import { Model } from '../Model.js';
export class PlanMachinePostModel extends Model {
    constructor(jsonData) {
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

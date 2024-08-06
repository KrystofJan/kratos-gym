import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class WrkOutPlanMachinePostModel extends Model {
    public wrkoutmachine_id: number;
    public wrkoutplan_id: number;
    public sets: number;
    public reps: number;
    public wrkout_start_time: Date;
    public wrkout_end_time: Date;
    public can_disturb: boolean;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.wrkoutmachine_id = jsonData.WrkOutMachineId;
        this.wrkoutplan_id = jsonData.WrkOutPland;
        this.sets = jsonData.Sets;
        this.reps = jsonData.Reps;
        this.wrkout_start_time = jsonData.WrkOutStartTime;
        this.wrkout_end_time = jsonData.WrkOutEndTime;
        this.can_disturb = jsonData.CanDisturb;
    }
}

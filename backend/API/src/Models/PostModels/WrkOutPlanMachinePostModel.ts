import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class WrkOutPlanMachinePostModel extends Model {
    public WrkOutPlanId: number;
    public WrkOutMachineId: number;
    public Sets: number;
    public Reps: number;
    public WrkOutStartTime: Date;
    public WrkOutEndTime: Date;
    public CanDisturb: boolean;

    constructor(jsonData: IDictionary<any>){
        super();
        this.WrkOutMachineId = jsonData.WrkOutMachineId;
        this.WrkOutPlanId = jsonData.WrkOutPland;
        this.Sets = jsonData.Sets;
        this.Reps = jsonData.Reps;
        this.WrkOutStartTime = jsonData.WrkOutStartTime;
        this.WrkOutEndTime = jsonData.WrkOutEndTime;
        this.CanDisturb = jsonData.CanDisturb;
    }
}

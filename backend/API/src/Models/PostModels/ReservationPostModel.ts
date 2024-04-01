import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class ReservationPostModel extends Model {
    public AmmoutOfPeople: number;
    public ReservationTime: Date;
    public CustomerId: number;
    public TrainerId: number | null;
    public WrkOutPlanId: number;

    constructor(jsonData: IDictionary<any>){
        super();
        this.AmmoutOfPeople = jsonData.AmmoutOfPeople;
        this.ReservationTime = jsonData.ReservationTime;
        this.CustomerId = jsonData.CustomerId;
        this.TrainerId = jsonData.TrainerId ?? null;
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
    }
}

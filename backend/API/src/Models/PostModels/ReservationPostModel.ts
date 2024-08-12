import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class ReservationPostModel extends Model {
    public amount_of_people: number;
    public reservation_time: Date;
    public customer_id: number;
    public trainer_id: number | null;
    public plan_id: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.amount_of_people = jsonData.AmoutOfPeople;
        this.reservation_time = jsonData.ReservationTime;
        this.customer_id = jsonData.CustomerId;
        this.trainer_id = jsonData.TrainerId ?? null;
        this.plan_id = jsonData.PlanId;
    }
}

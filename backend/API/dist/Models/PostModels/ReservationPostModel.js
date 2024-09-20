import { Model } from '../Model.js';
export class ReservationPostModel extends Model {
    constructor(jsonData) {
        var _a;
        super();
        this.amount_of_people = jsonData.AmoutOfPeople;
        this.reservation_time = jsonData.ReservationTime;
        this.customer_id = jsonData.CustomerId;
        this.trainer_id = (_a = jsonData.TrainerId) !== null && _a !== void 0 ? _a : null;
        this.plan_id = jsonData.PlanId;
    }
}

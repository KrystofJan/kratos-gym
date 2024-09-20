import { Model } from '../Model.js';
// TODO: Move to models
export class ReservationGetModel extends Model {
    constructor(jsonData) {
        super();
        this.ReservationId = jsonData.ReservetionId;
        this.AmmoutOfPeople = jsonData.AmmoutOfPeople;
        this.ReservationTime = jsonData.ReservationTime;
        this.CustomerId = jsonData.CustomerId;
        this.TrainerId = jsonData.TrainerId;
        this.PlanId = jsonData.PlanId;
    }
}

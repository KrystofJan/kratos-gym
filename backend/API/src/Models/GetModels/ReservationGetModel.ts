import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';
// TODO: Move to models

export class ReservationGetModel extends Model implements GetModel {
    ReservationId: number;
    AmmoutOfPeople: number;
    ReservationTime: Date;
    CustomerId: number;
    TrainerId: number;
    PlanId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.ReservationId = jsonData.ReservetionId;
        this.AmmoutOfPeople = jsonData.AmmoutOfPeople;
        this.ReservationTime = jsonData.ReservationTime;
        this.CustomerId = jsonData.CustomerId;
        this.TrainerId = jsonData.TrainerId;
        this.PlanId = jsonData.PlanId;
    }
}

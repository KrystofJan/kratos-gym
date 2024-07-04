import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';
// TODO: Move to models

@Table("Reservation")
export class ReservationGetModel extends Model implements GetModel {
    @Column({ type: "number", columnName: "ReservationId" })
    public ReservationId: number;
    @Column({ type: "number", columnName: "AmmoutOfPeople" })
    public AmmoutOfPeople: number;
    @Column({ type: "date", columnName: "ReservationTime" })
    public ReservationTime: Date;
    @Column({ type: "number", columnName: "CustomerId" })
    public CustomerId: number;
    @Column({ type: "number", columnName: "TrainerId" })
    public TrainerId: number;
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.ReservationId = jsonData.ReservetionId;
        this.AmmoutOfPeople = jsonData.AmmoutOfPeople;
        this.ReservationTime = jsonData.ReservationTime;
        this.CustomerId = jsonData.CustomerId;
        this.TrainerId = jsonData.TrainerId;
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
    }
}

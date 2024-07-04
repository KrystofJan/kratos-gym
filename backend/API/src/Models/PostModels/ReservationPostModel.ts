import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

@Table("Reservation")
export class ReservationPostModel extends Model {
    @Column({ type: "number", columnName: "AmmoutOfPeople" })
    public AmmoutOfPeople: number;
    @Column({ type: "date", columnName: "ReservationTime" })
    public ReservationTime: Date;
    @Column({ type: "number", columnName: "CustomerId" })
    public CustomerId: number;
    @Column({ type: "number", columnName: "TrainerId" })
    public TrainerId: number | null;
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.AmmoutOfPeople = jsonData.AmmoutOfPeople;
        this.ReservationTime = jsonData.ReservationTime;
        this.CustomerId = jsonData.CustomerId;
        this.TrainerId = jsonData.TrainerId ?? null;
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
    }
}

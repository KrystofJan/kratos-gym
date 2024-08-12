import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';

export class Machine extends Model {
    public MachineId: number | null;
    public MachineName: string;
    public MaxWeight: number;
    public MinWeight: number;
    public MaxPeople: number;
    public AvgTimeTaken: number;
    public PopularityScore: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.MachineId = jsonData.MachineId ?? null;
        this.MachineName = jsonData.MachineName;
        this.MaxWeight = jsonData.MaxWeight ?? 0;
        this.MinWeight = jsonData.MinWeight ?? 0;
        this.MaxPeople = jsonData.MaxPeople;
        this.AvgTimeTaken = jsonData.AvgTimeTaken;
        this.PopularityScore = jsonData.PopularityScore ?? 0;
    }
}

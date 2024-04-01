import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';

export class WrkOutMachine extends Model{
    public WrkOutMachineId: number | null;
    public MachineName: string;
    public MaxWeight: number;
    public MinWeight: number;
    public MaxPeople: number;
    public AvgTimeTaken: number;
    public PopularityScore: number;

    constructor(jsonData: IDictionary<any>){
        super();
        this.WrkOutMachineId = jsonData.WrkOutMachineId ?? null;
        this.MachineName = jsonData.MachineName;
        this.MaxWeight = jsonData.MaxWeight ?? 0;
        this.MinWeight = jsonData.MinWeight ?? 0;
        this.MaxPeople = jsonData.MaxPeople;
        this.AvgTimeTaken = jsonData.AvgTimeTaken;
        this.PopularityScore = jsonData.PopularityScore ?? 0;
    }
}

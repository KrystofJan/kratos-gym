import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class WrkOutMachinePostModel extends Model {
    public MachineName: string;
    public MaxWeight: number;
    public MinWeight: number;
    public MaxPeople: number;
    public AvgTimeTaken: number;
    public PopularityScore: number;


    constructor(jsonData: IDictionary<any>){
        super();
        this.MachineName = jsonData.MachineName;
        this.MaxWeight = jsonData.MaxWeight;
        this.MinWeight = jsonData.MinWeight;
        this.MaxPeople = jsonData.MaxPeople;
        this.AvgTimeTaken = jsonData.AvgTimeTaken;
        this.PopularityScore = jsonData.PopularityScore;
    }
}

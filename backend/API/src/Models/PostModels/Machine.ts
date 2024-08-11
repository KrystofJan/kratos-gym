import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class MachinePostModel extends Model {
    public machine_name: string;
    public max_weight: number;
    public min_weight: number;
    public max_people: number;
    public avg_time_taken: number;
    public popularity_score: number;


    constructor(jsonData: IDictionary<any>) {
        super();
        this.machine_name = jsonData.MachineName;
        this.max_weight = jsonData.MaxWeight;
        this.min_weight = jsonData.MinWeight;
        this.max_people = jsonData.MaxPeople;
        this.avg_time_taken = jsonData.AvgTimeTaken;
        this.popularity_score = jsonData.PopularityScore;
    }
}

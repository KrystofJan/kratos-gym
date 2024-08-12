import { Model } from '../Model.js';
export class MachinePostModel extends Model {
    constructor(jsonData) {
        super();
        this.machine_name = jsonData.MachineName;
        this.max_weight = jsonData.MaxWeight;
        this.min_weight = jsonData.MinWeight;
        this.max_people = jsonData.MaxPeople;
        this.avg_time_taken = jsonData.AvgTimeTaken;
        this.popularity_score = jsonData.PopularityScore;
    }
}

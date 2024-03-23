import { IDictionary } from "../../utils/Utilities.js";
import { Model } from './Model.js';

export class WrkOutMachine extends Model{
    public WrkOutMachineId: number | null;
    public MachineName: string;
    public MaxWeight: number;
    public MinWeight: number;
    public MaxPeople: number;
    public AvgTimeTaken: number;
    public PopularityScore: number;
    public ExerciseTypeName: string;
    public BodyPart: string;


    constructor(jsonData: IDictionary<any>){
        super();
        this.WrkOutMachineId = jsonData.WrkOutMachineId ?? null;
        this.MachineName = jsonData.MachineName;
        this.MaxWeight = jsonData.MaxWeight ?? 0;
        this.MinWeight = jsonData.MinWeight ?? 0;
        this.MaxPeople = jsonData.MaxPeople;
        this.AvgTimeTaken = jsonData.AvgTimeTaken;
        this.PopularityScore = jsonData.PopularityScore;
        this.ExerciseTypeName = jsonData.ExerciseTypeName ?? "";
        this.BodyPart = jsonData.BodyPart ?? ""
    }

    // constructJsonForRecommend(){
    //     return {
    //         "WrkOutMachineId": this.WrkOutMachineId,
    //         "MachineName": this.MachineName,
    //         "PopularityScore": this.PopularityScore,
    //         "ExerciseTypeName": this.ExerciseTypeName,
    //         "BodyPart": this.BodyPart
    //     }
    // }
}

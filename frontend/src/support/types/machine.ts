import { ExerciseType } from "..";

export interface Machine {
    MachineId: number | null;
    MachineName: string;
    MaxWeight: number;
    MinWeight: number;
    MaxPeople: number;
    AvgTimeTaken: number;
    PopularityScore: number;
    ExerciseTypes: ExerciseType[]
}


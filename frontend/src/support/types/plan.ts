import { Account, ExerciseType, MachinesInPlan } from '..'

export interface Plan {
    PlanId: number;
    PlanName: string;
    User: Account | undefined;
    Machines: MachinesInPlan[]
    ExerciseTypes: ExerciseType[]
}


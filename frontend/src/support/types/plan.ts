import { Account } from './account'

export interface Plan {
    PlanId: number;
    PlanName: string;
    User: Account | undefined;
    // TODO: finish
    // Machines: MachinesInPlan[]
    // ExerciseTypes: ExerciseType[]
}


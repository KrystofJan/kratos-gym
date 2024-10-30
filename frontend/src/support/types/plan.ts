import { Account, ExerciseCategory, MachinesInPlan } from '..'
import { MachinesInPlanPost } from './machines-in-plan'

export interface Plan {
    PlanId: number;
    PlanName: string;
    User: Account | undefined;
    Machines: MachinesInPlan[]
    ExerciseCategories: ExerciseCategory[]
}


export interface PlanPost {
    PlanName: string;
    AccountId: number,
    Machines: MachinesInPlanPost[]
    ExerciseCategories: ExerciseCategory[]
}

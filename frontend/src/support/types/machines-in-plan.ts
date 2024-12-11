import { Time } from "@internationalized/date";

export interface MachinesInPlan {
    PlanId?: number;
    MachineId: number;
    Sets: number;
    Reps: number;
    StartTime: Time;
    EndTime: Time;
    CanDisturb: boolean
}

export interface MachinesInPlanPost {
    PlanId?: number;
    MachineId: number;
    Sets: number;
    Reps: number;
    StartTime: string;
    EndTime: string;
    CanDisturb: boolean
}

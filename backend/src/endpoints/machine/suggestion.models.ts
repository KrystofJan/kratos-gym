import { Plan } from '../plan'
import { Time } from "@internationalized/date";



export interface PlanShort {
    PlanId: number
    StartTime: string
    EndTime: string
}

export interface SimplifiedPlan {

}

export interface SimplifiedMachineUsage {
    PlanId: number
    StartTime: string
    EndTime: string
    Prev: PlanShort | null
    Next: PlanShort | null
}

export interface PlanRaw {
    PlanId: number
    StartTime: Date
    EndTime: Date
    PrevId: number | null
    NextId: number | null
}

export interface TimeRange {
    StartTime: Time,
    EndTime: Time,
}

export interface Suggestion {
    PrevSuggestion: TimeRange,
    NextSuggestion: TimeRange
}

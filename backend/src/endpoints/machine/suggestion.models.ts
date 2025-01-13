import { Plan } from '../plan'
import { Time } from '@internationalized/date'

export interface Suggestion {
    PrevSuggestion: TimeRange
    NextSuggestion: TimeRange
}

export interface PlanShort {
    PlanId: number
    StartTime: string
    EndTime: string
    CanDisturb: boolean
    CanFit: boolean
}

export interface SimplifiedMachineUsage {
    PlanId: number
    StartTime: string
    EndTime: string
    Prev: PlanShort | null
    Next: PlanShort | null
    CanDisturb: boolean
    CanFit: boolean
}

export interface PlanRaw {
    PlanId: number
    StartTime: Date
    EndTime: Date
    PrevId: number | null
    NextId: number | null
    CanDisturb: boolean
    CanFit: boolean
}

export interface TimeRange {
    StartTime: Time
    EndTime: Time
    isColiding: boolean
}

export interface Suggestion {
    PrevSuggestion: TimeRange
    NextSuggestion: TimeRange
}

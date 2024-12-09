import { Time } from "@internationalized/date";

export interface TimeSuggestion {
    Previous: TimeRange
    Next: TimeRange
}

export interface TimeRange {
    time: [Time, Time],
    isColiding: boolean
}

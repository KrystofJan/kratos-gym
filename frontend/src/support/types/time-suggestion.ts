import { Time } from "@internationalized/date";

export interface TimeSuggestion {
    Previous: [Time, Time],
    Next: [Time, Time]
}

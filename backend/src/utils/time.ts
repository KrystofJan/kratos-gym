import { Time } from '@internationalized/date'
import { GraphNode } from '../endpoints/plan-generator/graph/graph.model'

export class TimeUtils {
    static compareNodesTime(a: GraphNode, b: GraphNode) {
        const t1Value = a.value.end_time.hour * 60 + a.value.end_time.minute
        const t2Value = b.value.end_time.hour * 60 + b.value.end_time.minute
        return t1Value - t2Value
    }

    static compareTime(time1: Time, time2: Time, operator: string) {
        const t1Value = time1.hour * 60 + time1.minute
        const t2Value = time2.hour * 60 + time2.minute
        switch (operator) {
            case '>':
                return t1Value > t2Value
            case '>=':
                return t1Value >= t2Value
            case '<':
                return t1Value < t2Value
            case '<=':
                return t1Value <= t2Value
            case '===':
                return t1Value === t2Value
            default:
                throw new Error('operator ' + operator + 'is undefined')
        }
    }

    static canFitInTime(timerange: [Time, Time], time: Time) {
        const [start, end] = timerange
        return (
            TimeUtils.compareTime(start, time, '<=') &&
            TimeUtils.compareTime(end, time, '>')
        )
    }

    static addTime(time: Time, seconds: number): Time {
        const totalSeconds =
            time.hour * 3600 + time.minute * 60 + time.second + seconds
        const newHours = Math.floor(totalSeconds / 3600) % 24
        const newMinutes = Math.floor((totalSeconds % 3600) / 60)

        return new Time(newHours, newMinutes)
    }
}

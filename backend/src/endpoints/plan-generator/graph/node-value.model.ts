import { IDictionary } from '../../../utils'
import { Model } from '../../base'
import { Machine } from '../../machine'
import { Reservation } from '../../reservation'
import { Time } from '@internationalized/date'

export class NodeValue extends Model {
    machine: Machine
    start_time: Time
    end_time: Time
    reservation?: Reservation
    can_collide: boolean

    constructor(jsonData: IDictionary<any>) {
        super()
        if (jsonData['machine']) {
            this.machine = jsonData['machine']
        } else {
            this.machine = new Machine(jsonData)
        }

        if (typeof jsonData['start_time'] === 'string') {
            const st = jsonData['start_time'].split(':')
            this.start_time = new Time(Number(st[0]), Number(st[1]))
        } else {
            this.start_time = jsonData['start_time']
        }

        if (typeof jsonData['end_time'] === 'string') {
            const et = jsonData['end_time'].split(':')
            this.end_time = new Time(Number(et[0]), Number(et[1]))
        } else {
            this.end_time = jsonData['end_time']
        }

        if (jsonData['reservation']) {
            this.reservation = new Reservation(jsonData)
        }

        if (jsonData['can_disturb'] !== undefined) {
            this.can_collide = jsonData['can_disturb']
        } else {
            this.can_collide = true
        }
    }
}

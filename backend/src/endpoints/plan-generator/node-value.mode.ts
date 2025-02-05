import { IDictionary } from '../../utils'
import { Model } from '../base'
import { Machine } from '../machine'
import { Reservation } from '../reservation'
import { Time } from '@internationalized/date'

export class NodeValue extends Model {
    machine: Machine
    start_time: Time
    end_time: Time
    reservation?: Reservation
    can_collide: boolean

    constructor(jsonData: IDictionary<any>) {
        super()
        this.machine = new Machine(jsonData)
        this.end_time = jsonData['end_time']
        this.start_time = jsonData['start_time']
        if (jsonData['can_disturb']) {
            this.can_collide = jsonData['can_disturb']
        } else {
            this.can_collide = true
        }

        if (jsonData['reservation']) {
            this.reservation = new Reservation(jsonData)
        }
    }
}

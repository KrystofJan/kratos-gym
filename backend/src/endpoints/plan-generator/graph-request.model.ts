import { Time } from '@internationalized/date'

export interface GeneratorPost {
    machine_ids: number[]
    amount_of_people: number
    start_time: Time
    reservation_date: Date
}

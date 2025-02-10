import { Time } from '@internationalized/date'

export interface PlanGenerator {
  time: Time
  collisions: boolean
  continuous: boolean
  amount_of_people: number
  machine_ids: number[]
  reservation_date: Date
}

export interface PlanGeneratorResults {
  NodeId: number
  MachineId: number
  StartTime: Time
  EndTime: Time
}

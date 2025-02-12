import { Time } from '@internationalized/date'
import { format } from 'date-fns'
import {
  PlanGenerator,
  PlanGeneratorResult,
} from '../types/plan-generator.config'

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class PlanGeneratorService {
  constructor() {}

  private fillData(
    input: PlanGeneratorResult[][]
  ): Map<number, [Time, Time]>[] {
    return input.map(
      (x) => new Map(x.map((y) => [y.MachineId, [y.StartTime, y.EndTime]]))
    )
  }

  async Generate(
    planConfig: PlanGenerator
  ): Promise<[Map<number, [Time, Time]>[], PlanGeneratorResult[]]> {
    const cfg = {
      amount_of_people: planConfig.amount_of_people,
      start_time: {
        hour: planConfig.time.hour,
        minute: planConfig.time.minute,
      },
      machine_ids: planConfig.machine_ids,
      reservation_date: format(planConfig.reservation_date, 'yyyy-MM-dd'),
    }
    try {
      const res = await fetch(
        `${KRATOS_API_URL}/api/plan-generator/generate?collisions=${planConfig.collisions}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(cfg),
        }
      )
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      return [this.fillData(data), data]
    } catch (error) {
      console.error('Error creating address:', error)
      throw error
    }
  }
}

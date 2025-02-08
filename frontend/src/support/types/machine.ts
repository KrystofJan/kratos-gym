import { ExerciseType } from '..'

export interface Machine {
  MachineId: number
  MachineName: string
  MaxWeight: number
  MinWeight: number
  MaxPeople: number
  AvgTimeTaken: number
  PopularityScore: number
  ExerciseTypes: ExerciseType[]
}

export interface MachinePost {
  MachineName: string
  MaxWeight: number
  MinWeight: number
  MaxPeople: number
  AvgTimeTaken: number
}

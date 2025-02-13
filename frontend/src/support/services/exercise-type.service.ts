import type { ExerciseType, ExerciseTypePost } from '../types'
import BaseService from './base-service'

export class ExerciseTypeService extends BaseService<
  ExerciseType,
  ExerciseTypePost
> {
  constructor() {
    super('exercise-type')
  }
}

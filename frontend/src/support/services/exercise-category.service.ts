import { ExerciseCategory, ExerciseCategoryPost } from '..'
import BaseService from './base-service'

export class ExerciseCategoryService extends BaseService<
  ExerciseCategory,
  ExerciseCategoryPost
> {
  constructor() {
    super('exercise-category')
  }
}

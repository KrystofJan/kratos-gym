import type { ExerciseCategoryPost, ExerciseType, ExerciseTypePost } from '../types';
import { fillParamValues } from '../request-utils';
import BaseService from './base-service';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class ExerciseTypeService extends BaseService<ExerciseType, ExerciseTypePost> {

    constructor() {
        super("exercise-type")
    }
}

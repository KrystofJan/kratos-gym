import { ExerciseCategory, ExerciseCategoryPost } from '..';
import { fillParamValues } from '../request-utils';
import BaseService from './base-service';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class ExerciseCategoryService extends BaseService<ExerciseCategory, ExerciseCategoryPost> {

    constructor() {
        super("exercise-category")
    }
}


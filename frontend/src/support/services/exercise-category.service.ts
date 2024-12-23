import { ExerciseCategory } from '..';
import { fillParamValues } from '../request-utils';

const KRATOS_API_URL = import.meta.env.VITE_KRATOS_API_URL

export class ExerciseCategoryService {

    constructor() {
    }

    async FetchExerciseCategory(options?: { page?: number, limit?: number }): Promise<ExerciseCategory[]> {
        try {
            let params = ""
            if (options) {
                params = fillParamValues(options)
            }
            const res = await fetch(`${KRATOS_API_URL}/api/exercise-category${params}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }
}


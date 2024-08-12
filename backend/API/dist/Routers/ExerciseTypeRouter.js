import express from 'express';
import { getAllExerciseTypes, getExerciseTypeById, postExerciseType } from '../Controller/ExerciseTypeController.js';
export const ExerciseTypeRouter = express.Router();
ExerciseTypeRouter.get('/', (req, res) => {
    getAllExerciseTypes(req, res);
});
ExerciseTypeRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    getExerciseTypeById(req, res, id);
});
ExerciseTypeRouter.post('/', (req, res) => {
    postExerciseType(req, res);
});

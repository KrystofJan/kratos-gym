import express from 'express';
import { getAllExerciseTypes, getExerciseTypeById, postExerciseType } from '../Controller/ExerciseTypeController.js';
export var ExerciseTypeRouter = express.Router();
ExerciseTypeRouter.get('/', function (req, res) {
    getAllExerciseTypes(req, res);
});
ExerciseTypeRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getExerciseTypeById(req, res, id);
});
ExerciseTypeRouter.post('/', function (req, res) {
    postExerciseType(req, res);
});

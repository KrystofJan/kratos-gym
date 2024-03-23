import express, { Request, Response, Router } from 'express';
const exerciseTypeController = require('../Controller/ExerciseTypeController');

export const ExerciseTypeRouter: Router = express.Router();


ExerciseTypeRouter.get('/', (req, res) => {
    exerciseTypeController.getAll(req, res);
});

ExerciseTypeRouter.get('/:id', (req, res) => {
    exerciseTypeController.getId(req, res, req.params['id']);
});

ExerciseTypeRouter.post('/', (req, res) => {
    exerciseTypeController.post(req, res);
});

module.exports = ExerciseTypeRouter;
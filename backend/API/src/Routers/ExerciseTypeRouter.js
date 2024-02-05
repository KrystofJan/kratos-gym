const express = require('express');
const exerciseTypeController = require('../Controller/ExerciseTypeController');

const ExerciseTypeRouter = express.Router();


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
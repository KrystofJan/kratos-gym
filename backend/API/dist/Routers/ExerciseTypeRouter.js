import express from 'express';
var exerciseTypeController = require('../Controller/ExerciseTypeController');
export var ExerciseTypeRouter = express.Router();
ExerciseTypeRouter.get('/', function (req, res) {
    exerciseTypeController.getAll(req, res);
});
ExerciseTypeRouter.get('/:id', function (req, res) {
    exerciseTypeController.getId(req, res, req.params['id']);
});
ExerciseTypeRouter.post('/', function (req, res) {
    exerciseTypeController.post(req, res);
});
module.exports = ExerciseTypeRouter;

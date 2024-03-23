import express from 'express';
var machineExerciseTypesController = require('../Controller/MachineExerciseTypesController');
export var MachineExerciseTypesRouter = express.Router();
MachineExerciseTypesRouter.get('/machine/:id', function (req, res) {
    machineExerciseTypesController.getIdMachine(req, res, req.params['id']);
});
MachineExerciseTypesRouter.get('/type/:id', function (req, res) {
    machineExerciseTypesController.getIdType(req, res, req.params['id']);
});
MachineExerciseTypesRouter.post('/', function (req, res) {
    machineExerciseTypesController.post(req, res);
});

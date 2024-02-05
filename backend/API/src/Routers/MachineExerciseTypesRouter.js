const express = require('express');
const machineExerciseTypesController = require('../Controller/MachineExerciseTypesController');

const MachineExerciseTypesRouter = express.Router();


MachineExerciseTypesRouter.get('/machine/:id', (req, res) => {
    machineExerciseTypesController.getIdMachine(req, res,req.params['id']);
});

MachineExerciseTypesRouter.get('/type/:id', (req, res) => {
    machineExerciseTypesController.getIdType(req, res, req.params['id']);
});

MachineExerciseTypesRouter.post('/', (req, res) => {
    machineExerciseTypesController.post(req, res);
});

module.exports = MachineExerciseTypesRouter;
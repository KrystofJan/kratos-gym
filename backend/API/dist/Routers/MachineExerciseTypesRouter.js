import { getMachineExerciseTypesByExerciseTypeId, getMachineExerciseTypesByWrkOutMachineId, postMachineExerciseTypes } from './../Controller/MachineExerciseTypesController.js';
import express from 'express';
export var MachineExerciseTypesRouter = express.Router();
MachineExerciseTypesRouter.get('/machine/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getMachineExerciseTypesByWrkOutMachineId(req, res, id);
});
MachineExerciseTypesRouter.get('/type/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getMachineExerciseTypesByExerciseTypeId(req, res, id);
});
MachineExerciseTypesRouter.post('/', function (req, res) {
    postMachineExerciseTypes(req, res);
});

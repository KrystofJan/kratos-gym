import { getMachineExerciseTypesByExerciseTypeId, getMachineExerciseTypesByMachineId, postMachineExerciseTypes } from './../Controller/MachineExerciseTypesController.js';
import express from 'express';
export const MachineExerciseTypesRouter = express.Router();
MachineExerciseTypesRouter.get('/machine/:id', (req, res) => {
    let id = parseInt(req.params['id']);
    getMachineExerciseTypesByMachineId(req, res, id);
});
MachineExerciseTypesRouter.get('/type/:id', (req, res) => {
    let id = parseInt(req.params['id']);
    getMachineExerciseTypesByExerciseTypeId(req, res, id);
});
MachineExerciseTypesRouter.post('/', (req, res) => {
    postMachineExerciseTypes(req, res);
});

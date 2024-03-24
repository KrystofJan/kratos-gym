import { getMachineExerciseTypesByExerciseTypeId, getMachineExerciseTypesByWrkOutMachineId, postMachineExerciseTypes } from './../Controller/MachineExerciseTypesController.js';
import express, { Request, Response, Router } from 'express';

export const MachineExerciseTypesRouter: Router = express.Router();


MachineExerciseTypesRouter.get('/machine/:id', (req: Request, res: Response) => {
    let id = parseInt(req.params['id']);
    getMachineExerciseTypesByWrkOutMachineId(req, res, id);
});

MachineExerciseTypesRouter.get('/type/:id', (req: Request, res: Response) => {
    let id = parseInt(req.params['id']);
    getMachineExerciseTypesByExerciseTypeId(req, res, id);
});

MachineExerciseTypesRouter.post('/', (req: Request, res: Response) => {
    postMachineExerciseTypes(req, res)
});

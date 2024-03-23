import express, { Request, Response, Router } from 'express';
const machineExerciseTypesController = require('../Controller/MachineExerciseTypesController');

export const MachineExerciseTypesRouter: Router = express.Router();


MachineExerciseTypesRouter.get('/machine/:id', (req: Request, res: Response) => {
    machineExerciseTypesController.getIdMachine(req, res,req.params['id']);
});

MachineExerciseTypesRouter.get('/type/:id', (req: Request, res: Response) => {
    machineExerciseTypesController.getIdType(req, res, req.params['id']);
});

MachineExerciseTypesRouter.post('/', (req: Request, res: Response) => {
    machineExerciseTypesController.post(req, res);
});

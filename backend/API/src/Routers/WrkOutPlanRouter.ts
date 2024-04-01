import { getAllWrkOutPlans, getWrkOutPlanById, postMachineToPlan, getExerciseTypeByPlanId, postWrkOutPlan, postExerciseTypeToPlan, getMachineByPlanId } from './../Controller/WrkOutPlanController.js';
import express, { Request, Response, Router } from 'express';

export const WrkOutPlanRouter = express.Router();

WrkOutPlanRouter.get('/', (req: Request, res: Response) => {
    getAllWrkOutPlans(req, res);
});

WrkOutPlanRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params['id']);
    getWrkOutPlanById(req, res, id);
});

WrkOutPlanRouter.get('/:id/machines', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    getMachineByPlanId(req, res, id);
});

WrkOutPlanRouter.get('/:id/types', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    getExerciseTypeByPlanId(req, res, id);
});

WrkOutPlanRouter.post('/', (req: Request, res: Response) => {
    postWrkOutPlan(req, res);
});

WrkOutPlanRouter.post('/:id/addMachine', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    postMachineToPlan(req, res, id);
});

WrkOutPlanRouter.post('/:id/addType', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    postExerciseTypeToPlan(req, res, id);
});

import { getAllPlans, getPlanById, postMachineToPlan, getExerciseTypeByPlanId, postPlan, postExerciseTypeToPlan, getMachineByPlanId } from './../Controller/PlanController.js';
import express, { Request, Response, Router } from 'express';

export const PlanRouter = express.Router();

PlanRouter.get('/', (req: Request, res: Response) => {
    getAllPlans(req, res);
});

PlanRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params['id']);
    getPlanById(req, res, id);
});

PlanRouter.get('/:id/machines', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    getMachineByPlanId(req, res, id);
});

PlanRouter.get('/:id/types', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    getExerciseTypeByPlanId(req, res, id);
});

PlanRouter.post('/', (req: Request, res: Response) => {
    postPlan(req, res);
});

PlanRouter.post('/:id/addMachine', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    postMachineToPlan(req, res, id);
});

PlanRouter.post('/:id/addType', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    postExerciseTypeToPlan(req, res, id);
});

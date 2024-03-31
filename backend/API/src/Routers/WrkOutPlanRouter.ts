import { getAllWrkOutPlans, getWrkOutPlanById, postMachineToPlan, postWrkOutPlan, getMachineByPlanId } from './../Controller/WrkOutPlanController.js';
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

WrkOutPlanRouter.post('/:id/machine', (req: Request, res: Response) => {
    const id: number = parseInt(req.params['id']);
    postMachineToPlan(req, res, id);
});


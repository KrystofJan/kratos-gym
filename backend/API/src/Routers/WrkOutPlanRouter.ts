import { getAllWrkOutPlans, getWrkOutPlanById, postWrkOutPlan } from './../Controller/WrkOutPlanController.js';
import express, { Request, Response, Router } from 'express';

export const WrkOutPlanRouter = express.Router();

WrkOutPlanRouter.get('/', (req, res) => {
    getAllWrkOutPlans(req, res);
});

WrkOutPlanRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    getWrkOutPlanById(req, res, id);
});

WrkOutPlanRouter.post('/', (req, res) => {
    postWrkOutPlan(req, res);
})

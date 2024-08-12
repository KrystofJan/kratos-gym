import { getAllPlans, getPlanById, postMachineToPlan, getExerciseTypeByPlanId, postPlan, postExerciseTypeToPlan, getMachineByPlanId } from './../Controller/PlanController.js';
import express from 'express';
export const PlanRouter = express.Router();
PlanRouter.get('/', (req, res) => {
    getAllPlans(req, res);
});
PlanRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    getPlanById(req, res, id);
});
PlanRouter.get('/:id/machines', (req, res) => {
    const id = parseInt(req.params['id']);
    getMachineByPlanId(req, res, id);
});
PlanRouter.get('/:id/types', (req, res) => {
    const id = parseInt(req.params['id']);
    getExerciseTypeByPlanId(req, res, id);
});
PlanRouter.post('/', (req, res) => {
    postPlan(req, res);
});
PlanRouter.post('/:id/addMachine', (req, res) => {
    const id = parseInt(req.params['id']);
    postMachineToPlan(req, res, id);
});
PlanRouter.post('/:id/addType', (req, res) => {
    const id = parseInt(req.params['id']);
    postExerciseTypeToPlan(req, res, id);
});

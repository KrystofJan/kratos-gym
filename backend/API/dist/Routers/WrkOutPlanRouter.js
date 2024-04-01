import { getAllWrkOutPlans, getWrkOutPlanById, postMachineToPlan, getExerciseTypeByPlanId, postWrkOutPlan, postExerciseTypeToPlan, getMachineByPlanId } from './../Controller/WrkOutPlanController.js';
import express from 'express';
export var WrkOutPlanRouter = express.Router();
WrkOutPlanRouter.get('/', function (req, res) {
    getAllWrkOutPlans(req, res);
});
WrkOutPlanRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getWrkOutPlanById(req, res, id);
});
WrkOutPlanRouter.get('/:id/machines', function (req, res) {
    var id = parseInt(req.params['id']);
    getMachineByPlanId(req, res, id);
});
WrkOutPlanRouter.get('/:id/types', function (req, res) {
    var id = parseInt(req.params['id']);
    getExerciseTypeByPlanId(req, res, id);
});
WrkOutPlanRouter.post('/', function (req, res) {
    postWrkOutPlan(req, res);
});
WrkOutPlanRouter.post('/:id/addMachine', function (req, res) {
    var id = parseInt(req.params['id']);
    postMachineToPlan(req, res, id);
});
WrkOutPlanRouter.post('/:id/addType', function (req, res) {
    var id = parseInt(req.params['id']);
    postExerciseTypeToPlan(req, res, id);
});

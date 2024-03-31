import { getAllWrkOutPlans, getWrkOutPlanById, postWrkOutPlan } from './../Controller/WrkOutPlanController.js';
import express from 'express';
export var WrkOutPlanRouter = express.Router();
WrkOutPlanRouter.get('/', function (req, res) {
    getAllWrkOutPlans(req, res);
});
WrkOutPlanRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getWrkOutPlanById(req, res, id);
});
WrkOutPlanRouter.post('/', function (req, res) {
    postWrkOutPlan(req, res);
});

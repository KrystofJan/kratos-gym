var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FindAllPlans, FindPlanById, AddTypeToPlan, FindExerciseTypesContainedInId, FindMachinesContainedInId, CreatePlan, AddMachineToPlan, AddMultipleMachinesToPlan } from '../Managers/PlanManager.js';
import { PlanMachinePostModel } from '../Models/PostModels/PlanMachinePostModel.js';
import { Plan } from '../Models/Plan.js';
export const getPlanById = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindPlanById(id);
    response.buildResponse(req, res);
});
export const getAllPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindAllPlans();
    response.buildResponse(req, res);
});
export const postPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (Array.isArray(req.body)){
    //     const body: Array<PlanPostModel> = req.body;
    //     for(const plan of body){
    //     }
    // }
    const body = new Plan(req.body);
    const response = yield CreatePlan(body);
    response.buildResponse(req, res);
});
export const getMachineByPlanId = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindMachinesContainedInId(id);
    response.buildResponse(req, res);
});
const handlePostMultipleMachinesToPlan = (body, id) => __awaiter(void 0, void 0, void 0, function* () {
    for (const record of body) {
        record.wrkoutplan_id = id;
    }
    const response = yield AddMultipleMachinesToPlan(body);
    return response;
});
const handlePostSingleMachineToPlan = (body, id) => __awaiter(void 0, void 0, void 0, function* () {
    body.wrkoutplan_id = id;
    const response = yield AddMachineToPlan(body);
    return response;
});
export const postMachineToPlan = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    if (Array.isArray(req.body)) {
        const body = [];
        for (const b of req.body) {
            body.push(new PlanMachinePostModel(b));
        }
        response = yield handlePostMultipleMachinesToPlan(body, id);
    }
    else {
        const body = req.body;
        response = yield handlePostSingleMachineToPlan(body, id);
    }
    response.buildResponse(req, res);
});
export const postExerciseTypeToPlan = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    body.plan_id = id;
    const response = yield AddTypeToPlan(body);
    response.buildResponse(req, res);
});
export const getExerciseTypeByPlanId = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindExerciseTypesContainedInId(id);
    response.buildResponse(req, res);
});

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FindMachineById, FindAllMachines, RecommendMachine, FindOccupiedMachinesOnSpecificTime, CreateMachine } from '../Managers/MachineManager.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
import { MachinePostModel } from '../Models/PostModels/Machine.js';
export const getMachineById = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindMachineById(id);
    response.buildResponse(req, res);
});
export const getAllMachines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindAllMachines();
    response.buildResponse(req, res);
});
export const recommendMachine = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield RecommendMachine(id);
    response.buildResponse(req, res);
});
export const isOccupied = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const { time, date } = req.query;
    const response = yield FindOccupiedMachinesOnSpecificTime(id, time !== null && time !== void 0 ? time : '', date !== null && date !== void 0 ? date : '');
    response.buildResponse(req, res);
});
export const postMachine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reservation = new MachinePostModel(req.body);
    let response;
    if (!reservation.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = yield CreateMachine(reservation);
    response.buildResponse(req, res);
});

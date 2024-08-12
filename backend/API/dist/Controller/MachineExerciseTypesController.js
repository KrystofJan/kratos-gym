var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FindMachineExerciteTypeByExerciseTypeId, FindMachineExerciteTypeByMachineId, CreateMachineExerciseType } from '../Managers/MachineExerciseTypesManager.js';
import { MachineExerciseTypePostModel } from '../Models/PostModels/MachineExerciseTypePostModel.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
export const getMachineExerciseTypesByMachineId = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindMachineExerciteTypeByMachineId(id);
    response.buildResponse(req, res);
});
export const getMachineExerciseTypesByExerciseTypeId = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindMachineExerciteTypeByExerciseTypeId(id);
    response.buildResponse(req, res);
});
export const postMachineExerciseTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const machineExerciseType = new MachineExerciseTypePostModel(req.body);
    let response;
    if (!machineExerciseType.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = yield CreateMachineExerciseType(machineExerciseType);
    response.buildResponse(req, res);
});

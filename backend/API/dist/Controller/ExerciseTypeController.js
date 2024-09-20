var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FindAllExerciseTypes, FindExerciseTypeById, CreateExerciseType } from '../Managers/ExerciseTypeManager.js';
import { ExerciseType } from '../Models/ExerciseType.js';
import { BadRequestResponse } from '../RequestUtility/CustomResponces/BadRequestResponse.js';
// TODO: Add get by Plan
export const getAllExerciseTypes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindAllExerciseTypes();
    response.buildResponse(req, res);
});
export const getExerciseTypeById = (req, res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield FindExerciseTypeById(id);
    response.buildResponse(req, res);
});
export const postExerciseType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = new ExerciseType(req.body);
    let response;
    if (!address.validateAttrs()) {
        response = new BadRequestResponse("Unable to create ExerciseType model");
        response.buildResponse(req, res);
        return;
    }
    response = yield CreateExerciseType(address);
    response.buildResponse(req, res);
});

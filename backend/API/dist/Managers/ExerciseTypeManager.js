var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ExerciseTypeDAO } from '../DataLayer/AccessModels/ExerciseTypeDAO.js';
import { ExerciseType } from '../Models/ExerciseType.js';
import { OkResponse } from '../RequestUtility/CustomResponces/OkResponse.js';
import { CreatedResponse } from '../RequestUtility/CustomResponces/CreatedResponse.js';
import { FailedResponse } from '../RequestUtility/CustomResponces/FailedResponse.js';
export const FindAllExerciseTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exerciseTypeDAO = new ExerciseTypeDAO();
        const body = yield exerciseTypeDAO.SelectAllExerciseTypes();
        // validate...
        const results = [];
        for (const b of body) {
            const a = new ExerciseType(b);
            results.push(a);
        }
        return new OkResponse("We good", results);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const FindExerciseTypeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exerciseTypeDAO = new ExerciseTypeDAO();
        const body = yield exerciseTypeDAO.SelectExerciseTypeById(id);
        // validate...
        const result = new ExerciseType(body);
        return new OkResponse("We good", result);
    }
    catch (err) {
        return new FailedResponse("Cannot get any of these things :(", 404);
    }
});
export const CreateExerciseType = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    // TODO better response
    try {
        const exerciseTypeDAO = new ExerciseTypeDAO();
        result = yield exerciseTypeDAO.InsertExerciseType(body);
        const successResult = result;
        return new CreatedResponse("Successfully created an ExerciseType", successResult.Body);
    }
    catch (err) {
        return new FailedResponse('Sadge', 404);
    }
});

// import { MachineExerciseTypePostModel } from "../Models/PostModels/MachineExerciseTypePostModel.js";
export {};
// TODO
// const MachineExerciseTypesDAO = require('../ORM/AccessModels/MachineExerciseTypesDAO');
// const machineManager = require('../Managers/WrkOutMachineManager');
// const MachineModel = require('../ORM/Models/WrkOutMachine');
// const ExerciseTypeModel = require('../ORM/Models/ExerciseType');
// const typeManager = require('../Managers//ExerciseTypeManager');
// const MachineExerciseTypesModel = require('../ORM/Models/MachineExerciseTypes');
// const MachineTypesGetModel = require('../RequestUtility/GetModels/MachineTypesGetModel');
// const SuccessfulResponse = require('../RequestUtility/CustomResponses/SuccessfulResponse');
// const FailedResponse = require('../RequestUtility/CustomResponses/FailedResponse');
// const BaseResponse = require('../RequestUtility/CustomResponses/BaseResponse');
// const MachineTypesPostModel = require('../RequestUtility/PostModels/MachineTypesPostModel');
// // TODO change MachineExerciseTypePostModel to GetModel
// export const buildBody = async (machineType: Array<MachineExerciseTypePostModel>) => {
//     const result = [];
//     for(const mt of machineType){
//         const machineBody = await machineManager.getId(mt.WrkOutMachineId); 
//         const typeBody = await typeManager.get(mt.ExerciseTypeId);
//         const machine = new MachineModel(machineBody);
//         const exerciseType = new ExerciseTypeModel(typeBody);
//         const getModel = new MachineTypesGetModel(machine, exerciseType);
//         const model = new MachineExerciseTypesModel(getModel);
//         result.push(model); // volam constructJson v controlleru
//     }
//     return result;
// }
// export const getIdMachine = async (id: number) => { // getByMachineId
//     try{
//         const machineTypesDAO = new MachineExerciseTypesDAO();
//         const machineType = await machineTypesDAO.getIdMachine(id);
//         const body = buildBody(machineType)
//         return new SuccessfulResponse(body);
//     }
//     catch(err){
//         return new FailedResponse(`Cannot get this types ids machine types: ${id}`);
//     }
// }
// /**
//  * 
//  * @param {Number} id 
//  * @returns {BaseResponse}
//  */
// const getIdType = async (id) => {
//     try{
//         console.log("Fetching id: ", id);
//         const machineTypesDAO = new MachineExerciseTypesDAO();
//         const machineType = await machineTypesDAO.getIdType(id);
//         return new SuccessfulResponse(machineType);
//         const result = await buildBody(machineType);
//     }
//     catch(err){
//         return new FailedResponse(`Cannot get this machine ids machine types: ${id}`)
//     }
// }
// /**
//  * 
//  * @param {MachineTypesPostModel} body
//  * @returns {BaseResponse}
//  */
// const post = async (body) => {
//     try{
//         const body = req.body;
//         const machineTypesDAO = new MachineExerciseTypesDAO();
//         const result = await machineTypesDAO.post(body);
//         return new SuccessfulResponse(result);
//         res.status(201).json(result);
//     }
//     catch(err){
//         return new FailedResponse("Cannot create an entry due to: ", err);
//     }
// }
// module.exports = {
//     getIdMachine,
//     getIdType,
//     post,
// }

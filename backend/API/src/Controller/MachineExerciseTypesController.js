const machineExerciseTypesService = require('../Services/MachineExerciseTypesService');
const machineService = require('../Services/WrkOutMachineService');
const MachineModel = require('../ORM/Models/WrkOutMachine');
const ExerciseTypeModel = require('../ORM/Models/ExerciseType');
const typeService = require('../Services//ExerciseTypeService');
const MachineExerciseTypesModel = require('../ORM/Models/MachineExerciseTypes');

const buildBody = async (machineType) => {
    const result = [];

    for(const mt of machineType){
            
        const machineBody = await machineService.getId(mt.WrkOutMachineId);
        const typeBody = await typeService.get(mt.ExerciseTypeId);

        const machine = new MachineModel(machineBody);
        const exerciseType = new ExerciseTypeModel(typeBody);

        const model = new MachineExerciseTypesModel({
            "WrkOutMachine": machine.constructJson(),
            "ExerciseType": exerciseType.constructJson()
        });
        result.push(model.constructJson(model));
    }
    return result;
}

const getIdMachine = async (req,res,id) => {
    try{
        const machineType = await machineExerciseTypesService.getIdMachine(id);

        const result = await buildBody(machineType);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getIdType = async (req,res,id) => {
    try{
        const machineType = await machineExerciseTypesService.getIdType(id);

        const result = await buildBody(machineType);
        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const post = async (req, res) => {
    try{
        const body = req.body;
        const result = await machineExerciseTypesService.post(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getIdMachine,
    getIdType,
    post,
}
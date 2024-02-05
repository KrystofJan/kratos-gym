const machineExerciseTypesService = require('../Services/MachineExerciseTypesService');
const machineService = require('../Services/WrkOutMachineService');
const MachineModel = require('../ORM/Models/WrkOutMachine');
const ExerciseTypeModel = require('../ORM/Models/ExerciseType');
const typeService = require('../Services//ExerciseTypeService');
const machineExerciseTypesModel = require('../ORM/Models/MachineExerciseTypes');

const getIdMachine = async (req,res,id) => {
    try{
        const machineType = await machineExerciseTypesService.getIdMachine(id);

        const result = [];

        for(const mt of machineType){
            
            const machineBody = await machineService.getId(mt.WrkOutMachineId);
            const typeBody = await typeService.get(mt.ExerciseTypeId);
    
            const machine = new MachineModel();
            const exerciseType = new ExerciseTypeModel();
            
            
            machine.constructFromJson(machineBody);
            console.log(machine);
            exerciseType.constructFromJson(typeBody);
    
            const model = new machineExerciseTypesModel({
                "WrkOutMachine": machine.constructJson(),
                "ExerciseType": exerciseType.constructJson()
            });
            result.push(model.constructJson(model));
        }


        res.status(200).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getIdType = async (req,res,id) => {
    try{
        const machineTypes = await machineExerciseTypesService.getIdType(id);
        console.log(machineTypes);

        const result = [];

        for(const mt of machineTypes){
            
            const machineBody = await machineService.getId(mt.WrkOutMachineId);
            const typeBody = await typeService.get(mt.ExerciseTypeId);
    
            const machine = new MachineModel();
            const exerciseType = new ExerciseTypeModel();
            
            machine.constructFromJson(machineBody);
            exerciseType.constructFromJson(typeBody);
    
            const model = new machineExerciseTypesModel({
                "WrkOutMachine": machine.constructJson(),
                "ExerciseType": exerciseType.constructJson()
            });
            result.push(model.constructJson(model));
        }


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
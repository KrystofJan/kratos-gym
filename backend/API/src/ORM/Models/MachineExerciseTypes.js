class MachineExerciseTypes{

    constructor(jsonData){
        this.exerciseType = jsonData.ExerciseType;
        this.machine = jsonData.WrkOutMachine;
    }

    constructJson(){
        return {
            "ExerciseType": this.exerciseType,
            "WrkOutMachine": this.machine,
        }
    }
}

module.exports = MachineExerciseTypes;

class WrkOutPlanMachinePreset{

    constructor(jsonData){
        this.wrkOutPlanPreset = jsonData.WrkOutPlanPreset;
        this.wrkOutMachine = jsonData.WrkOutMachine;
        this.sets = jsonData.Sets;
        this.reps = jsonData.Reps;
    }

    constructJson(){
        return{
            "WrkOutPlanPreset": this.wrkOutPlanPreset,
            "WrkOutMachine": this.wrkOutMachine,
            "Sets": this.sets,
            "Reps": this.reps
        }
    }
}

module.exports = WrkOutPlanMachinePreset;

const User = require('./User');

class WrkOutPlanMachine{

    constructor(jsonData){
        this.wrkOutPlan = jsonData.WrkOutPlan;
        this.wrkOutMachine = jsonData.WrkOutMachine;
        this.sets = jsonData.Sets;
        this.reps = jsonData.Reps;
        this.wrkOutStartTime = jsonData.WrkOutStartTime;
        this.wrkOutEndTime = jsonData.WrkOutEndTime;
        this.canDisturb = jsonData.CanDisturb;
    }

    constructJson(){
        return{
            "WrkOutPlan": this.wrkOutPlan,
            "WrkOutMachine": this.wrkOutMachine,
            "Sets": this.sets,
            "Reps": this.reps,
            "WrkOutStartTime": this.wrkOutStartTime,
            "WrkOutEndTime": this.wrkOutEndTime,
            "CanDisturb": this.canDisturb
        }
    }
}

module.exports = WrkOutPlanMachine;

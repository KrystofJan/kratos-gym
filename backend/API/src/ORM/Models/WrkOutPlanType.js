const User = require('./User');

class WrkOutPlan{

    constructor(jsonData){
        this.wrkOutPlan = jsonData.WrkOutPlan;
        this.exerciseType = jsonData.ExerciseType;
    }

    constructJson(){
        return{
            "WrkOutPlan": this.wrkOutPlan,
            "ExerciseType": this.exerciseType,
        }
    }
}
 
module.exports = WrkOutPlan;
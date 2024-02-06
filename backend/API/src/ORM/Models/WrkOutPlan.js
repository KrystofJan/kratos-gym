const User = require('./User');

class WrkOutPlan{

    constructor(jsonData){
        this.wrkOutPlanId = jsonData.WrkOutPlanId;
        this.planName = jsonData.PlanName;
        this.user = jsonData.User;
    }

    constructJson(){
        return{
            "WrkOutPlanId": this.wrkOutPlanId,
            "PlanName": this.planName,
            "User": this.user
        }
    }
}

module.exports = WrkOutPlan;
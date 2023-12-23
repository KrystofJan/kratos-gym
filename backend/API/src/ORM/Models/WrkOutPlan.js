const User = require('./User');

class WrkOutPlan{

    constructFromJson(jsonData){
        this.wrkOutPlanId = jsonData.WrkOutPlanId;
        this.planName = jsonData.PlanName;
        this.user = jsonData.User;
    }

    constructFromData(WrkOutPlanId, PlanName, User){
        this.wrkOutPlanId = WrkOutPlanId;
        this.planName = PlanName;
        this.user = User;
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
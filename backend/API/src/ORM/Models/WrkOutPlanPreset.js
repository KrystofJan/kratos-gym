const User = require('./User');

class WrkOutPlan{

    constructor(jsonData){
        this.wrkOutPlanPresetId = jsonData.WrkOutPlanPresetId;
        this.presetName = jsonData.PresetName;
        this.author = jsonData.User;
    }

    constructJson(){
        return{
            "WrkOutPlanPresetId": this.wrkOutPlanPresetId,
            "PresetName": this.presetName,
            "Author": this.author
        }
    }
}

module.exports = WrkOutPlan;
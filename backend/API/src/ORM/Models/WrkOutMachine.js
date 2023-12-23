class WrkOutMachine{

    constructFromJson(jsonData){
        this.wrkOutMachineId = jsonData.WrkOutMachineId;
        this.machineName = jsonData.MachineName;
        this.maxWeight = jsonData.MaxWeight;
        this.minWeight = jsonData.MinWeight;
        this.maxPeople = jsonData.MaxPeople;
        this.avgTimeTaken = jsonData.AvgTimeTaken;
        this.popularityScore = jsonData.PopularityScore;
    }

    constructFromData(WrkOutMachineId,MachineName,MaxWeight, MinWeight, MaxPeople, AvgTimeTaken, PopularityScore){
        this.wrkOutMachineId = WrkOutMachineId;
        this.machineName = MachineName;
        this.maxWeight = MaxWeight;
        this.minWeight = MinWeight;
        this.maxPeople = MaxPeople;
        this.avgTimeTaken = AvgTimeTaken;
        this.popularityScore = PopularityScore;
    }

    constructJson(){
        return{
            "WrkOutMachineId": this.wrkOutMachineId,
            "MachineName": this.machineName,
            "MaxWeight": this.maxWeight,
            "MinWeight": this.minWeight,
            "MaxPeople": this.maxPeople,
            "AvgTimeTaken": this.avgTimeTaken,
            "PopularityScore": this.popularityScore
        }
    }
}
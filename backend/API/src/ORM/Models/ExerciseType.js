class ExerciseType{
    constructor(){ }

    constructFromJson(jsonData){
        this.typeName = jsonData.ExerciseTypeName;
        this.category = jsonData.Category;
        this.bodyPart = jsonData.bodyPart;
    }
    
    constructFromData(typeName, category, bodyPart){
        this.typeName = typeName;
        this.category = category;
        this.bodyPart = bodyPart;
    }
}
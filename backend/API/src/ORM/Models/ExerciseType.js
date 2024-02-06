class ExerciseType{

    constructor(jsonData){
        this.exerciseTypeId = jsonData.ExerciseTypeId
        this.typeName = jsonData.ExerciseTypeName;
        this.category = jsonData.Category;
        this.bodyPart = jsonData.bodyPart;
    }

    constructJson(){
        return {
            "ExerciseTypeId": this.exerciseTypeId,
            "TypeName": this.typeName,
            "Category": this.category,
            "BodyPart": this.bodyPart
        }
    }
}

module.exports = ExerciseType;

export interface ExerciseType {
    ExerciseTypeId: number | null;
    TypeName: string;
    Category: string;
    BodyPart: string;
}

export const exerciseTypeCategoryPictureMap = new Map < string, string> [
    ["Lower body", "asd"]
]

import { ExerciseCategory } from "..";

export interface ExerciseType {
    ExerciseTypeId: number,
    TypeName: string;
    Category: ExerciseCategory;
    BodyPart: string;
}

export interface ExerciseTypePost {
    TypeName: string;
    CategoryId: number;
    BodyPart: string;
}

export const exerciseTypeCategoryPictureMap = new Map<string, string>([
    ["Lower body", "asd"]
])

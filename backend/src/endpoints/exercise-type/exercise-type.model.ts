import { IDictionary } from '../../utils'
import { Model } from '../base'
import {
    Column,
    PrimaryKey,
    Table,
    ForeignKey,
    DifferentlyNamedForeignKey,
} from '../../database'
import { ExerciseCategory } from '../exercise-category/exercise-category.model'

@Table('exercise_type')
@PrimaryKey('exercise_type_id')
export class ExerciseType extends Model {
    @Column('exercise_type_id')
    public ExerciseTypeId: number | null

    @Column('type_name')
    public TypeName: string

    @ForeignKey(ExerciseCategory)
    @DifferentlyNamedForeignKey('CategoryId')
    @Column('category_id')
    public Category?: ExerciseCategory

    @Column('body_part')
    public BodyPart: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(jsonData: IDictionary<any>) {
        super()

        this.ExerciseTypeId =
            jsonData['ExerciseTypeId'] ?? jsonData['exercise_type_id']
        this.TypeName = jsonData['TypeName'] ?? jsonData['type_name']
        this.Category = jsonData['Category'] ?? jsonData['category']

        if (jsonData['category']) {
            this.Category = jsonData['category']
        } else {
            this.Category = new ExerciseCategory(jsonData)
            if (!this.Category.CategoryId) {
                this.Category = undefined
            }
        }
        this.BodyPart = jsonData['BodyPart'] ?? jsonData['body_part']
    }
}

import { IDictionary } from '../../utils'
import { Model } from '../base'
import { Column, PrimaryKey, Table } from '../../database'

@Table('exercise_category')
@PrimaryKey('category_id')
export class ExerciseCategory extends Model {
    @Column('category_id')
    public CategoryId: number | null

    @Column('category_name')
    public CategoryName: string

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(jsonData: IDictionary<any>) {
        super()
        this.CategoryId = jsonData['CategoryId'] ?? jsonData['category_id']
        this.CategoryName =
            jsonData['CategoryName'] ?? jsonData['category_name']
    }
}

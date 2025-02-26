import { Model } from '../base'

export class TestingModel extends Model {
    id: number

    constructor(id: number) {
        super()
        this.id = id
    }
}

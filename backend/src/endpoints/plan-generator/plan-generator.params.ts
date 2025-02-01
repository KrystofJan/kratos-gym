import { RequestQueryParams } from '../base'

export interface PlanQueryParams extends RequestQueryParams {
    collisions: boolean
}

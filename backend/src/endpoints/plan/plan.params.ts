import { RequestQueryParams } from '../base'

export interface PlanQueryParams extends RequestQueryParams {
    date?: string
    machine_id?: number
}

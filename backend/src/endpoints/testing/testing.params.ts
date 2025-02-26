import { RequestQueryParams } from '../base'

export interface TestingQueryParams extends RequestQueryParams {
    table_name?: string
    id_name?: string
}

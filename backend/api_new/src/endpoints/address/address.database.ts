import { Database } from "../../database"
import {
    CustomResponse,
    OkResponse,
    FailedResponse
} from '../../request-utility'

import { Address } from "./address.model"

export const GetAllAddresses = async (): Promise<CustomResponse> => {
    const db = new Database()
    try {
        const body = await db.SelectAll(Address)
        return new OkResponse(body.Status, body.Body)
    } catch (err) {
        return new FailedResponse('internal server error', 500)
    }
}

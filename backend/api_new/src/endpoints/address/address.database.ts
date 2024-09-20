import { Database, DatabaseFoundSingle } from "../../database"
import { DatabaseCreated } from "../../database/database-response"
import {
    CustomResponse,
    OkResponse,
    FailedResponse,
    CreatedResponse
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

export const GetAddressById = async (id: number): Promise<CustomResponse> => {
    const db = new Database()

    try {
        const body = await db.SelectSpecific(Address, id)
        return new OkResponse(body.Status, body.Body)
    } catch (err) {
        return new FailedResponse('internal server error', 500)
    }
}

export const CreateAddress = async (body: Address): Promise<CustomResponse> => {
    const db = new Database()

    try {
        const res = await db.Insert(Address, body) as DatabaseCreated
        const model = new Address(res.Body)
        return new CreatedResponse("Everything is great!", Number(model.AddressId))
    } catch (err) {
        return new FailedResponse('internal server error', 500)
    }
}

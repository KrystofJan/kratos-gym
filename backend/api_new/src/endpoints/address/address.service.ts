import { Database } from "../../database"
import { DatabaseCreated, DatabaseFail, DatabaseFoundMultiple, DatabaseFoundSingle, DatabaseResponse } from "../../database/database-response"
import { Model } from "../Model"
import {
    CustomResponse,
    OkResponse,
    FailedResponse,
    CreatedResponse
} from '../../request-utility'
import { IDictionary, logger } from "../../utils"
import { DatabaseType } from "../../utils/utilities"

import { Address } from "./address.model"
import { MappingError } from "../../errors/mapping.error"
import { InternalError } from "../../errors/base.error"
import { safeAwait } from "../../utils/utilities"

export class AddressService {

    static async GetAllAddresses(): Promise<Array<Address>> {
        const db = new Database()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(Address));
        if (databaseErr === null) {
            logger.error(databaseErr)
            throw new DatabaseFail(databaseErr)
        }

        try {
            const models = databaseResponse.Body.map((model: Address) => new Address(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new MappingError("Mapping model at GetAllAddresses failed")
        }
    }



    static async GetAddressById(id: number): Promise<Address> {
        const db = new Database()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectSpecific(Address, id));
        if (databaseErr === null) {
            logger.error(databaseErr)
            throw new DatabaseFail(databaseErr)
        }

        const model = new Address(databaseResponse.Body)
        if (!model) {
            const err = new MappingError("Mapping model at GetAllAddresses failed")
            logger.error(err)
            throw err;
        }
        return model;
    }

    static async CreateAddress(body: Address): Promise<number> {
        const db = new Database()

        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(Address, body));
        if (databaseErr === null) {
            logger.error(databaseErr)
            throw new DatabaseFail(databaseErr)
        }

        const model = new Address(databaseResponse.Body)
        if (!model) {
            const err = new MappingError("Mapping model at GetAllAddresses failed")
            logger.error(err)
            throw err;
        }

        return Number(model.AddressId);
    }
}


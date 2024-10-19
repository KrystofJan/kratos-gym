import { BasicQueryDatabase } from "../../database"
import { logger } from "../../utils"
import { Address } from "./address.model"
import { safeAwait } from "../../utils/utilities"
import { CodedError, ErrorCode } from "../../errors/base.error"

export class AddressService {

    static async GetAllAddresses(): Promise<Array<Address>> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectAll(Address));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        try {
            const models = databaseResponse.Body.map((model: Address) => new Address(model))
            return models;
        } catch (err) {
            logger.error(err)
            throw new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAllAddresses failed")
        }
    }

    static async GetAddressById(id: number): Promise<Address> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.SelectSpecific(Address, id));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }
        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Address with an id: '${id}' was not found`)
        }

        const model = new Address(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAddressById failed")
            logger.error(err)
            throw err;
        }
        return model;
    }

    static async UpdateAddressById(id: number, body: Partial<Address>): Promise<Address> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Update(Address, id, body));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Address with an id: '${id}' was not Deleted`)
        }

        const model = new Address(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at GetAddressById failed")
            logger.error(err)
            throw err;
        }

        return model;
    }


    static async DeleteAddressById(id: number): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Delete(Address, id));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        if (databaseResponse.Body === undefined) {
            throw new CodedError(ErrorCode.NOT_FOUND_ERROR, `Address with an id: '${id}' was not Deleted`)
        }

        return databaseResponse.Body;
    }

    static async CreateAddress(body: Address): Promise<number> {
        const db = new BasicQueryDatabase()

        const [databaseErr, databaseResponse] = await safeAwait(db.Insert(Address, body));
        if (databaseErr !== null) {
            logger.error(databaseErr)
            throw databaseErr;
        }

        const model = new Address(databaseResponse.Body)
        if (!model) {
            const err = new CodedError(ErrorCode.MAPPING_ERROR, "Mapping model at CreateAddress failed")
            logger.error(err)
            throw err;
        }

        return Number(model.AddressId);
    }
}


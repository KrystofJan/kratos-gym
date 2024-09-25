import { Express } from "express";
import { AddressRouter } from "../endpoints/address/address.routes";
import { AccountRouter } from "../endpoints/account//account.routes";

export const setRoutes = (app: Express) => {
    app.use('/api/address', AddressRouter);
    app.use('/api/account', AccountRouter);

}

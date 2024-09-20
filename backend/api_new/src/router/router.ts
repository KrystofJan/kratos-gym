import { Express } from "express";
import { AddressRouter } from "../endpoints/address/address.routes";

export const setRoutes = (app: Express) => {
    app.use('/api/address', AddressRouter);
}

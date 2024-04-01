import { LoginAuth, CreateUser, FindUserById } from './../Managers/UserManager.js';
import { Response } from '../RequestUtility/CustomResponces/Response.js'
import { Request as expressRequest, Response as expressResponse } from 'express';
import { UserAuth } from '../Models/UserAuth.js';
import { UserRegPostModel } from '../Models/PostModels/UserRegPostModel.js'

export const LogIn = async (req: expressRequest, res: expressResponse) => {
    const userAuth = new UserAuth(req.body);

    const result: Response = await LoginAuth(userAuth);
    result.buildResponse(req, res);
}

export const Register = async (req: expressRequest, res: expressResponse) => {
    const registerBody = new UserRegPostModel(req.body);
    
    const result: Response = await CreateUser(registerBody);
    result.buildResponse(req, res);
}

export const GetId = async (req: expressRequest, res: expressResponse, id: number) => {
    const result: Response = await FindUserById(id);
    result.buildResponse(req, res);
}

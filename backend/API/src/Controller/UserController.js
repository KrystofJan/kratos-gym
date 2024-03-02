const userService = require('../Services/UserService');
const UserModel = require('../ORM/Models/User');
const UserAuthModel = require('../ORM/Models/UserAuth');

const loginAuth = async (req, res) => {
    try{
        const userAuth = new UserAuthModel(req.body);
        
        let result = [];

        if(userAuth.loginOrEmail.includes('@')){
            result = await userService.getValueEmail(userAuth.loginOrEmail);
        }

        else {
            result = await userService.getValueLogin(userAuth.loginOrEmail);
        }

        if (result.length == 0){
            throw {"status": "Wrong email/login", "error_code": 0}
        }

        const real_result = result[0];

        if (real_result.Password != userAuth.encodedPassword){
            throw {"status": "wrong password", "error_code": 1};
        }

        res.status(200).json({
            "status":"Successfull login!", 
            "userId": real_result.UserId,
        });
    }
    catch(err){
        res.status(500).json(err);
    }
}

const register = async (req, res) => {
    try{
        const body = req.body;
        const result = await userService.register(body);

        res.status(201).json(result);
    }
    catch(err){
        res.status(500).json(err);
    }
}

const getId = async (req, res, id) => {
    try{
        const body = req.body;
        const result = await userService.getId(id);
        res.status(201).json(result);
    }
    catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {
    loginAuth,
    register,
    getId,
}
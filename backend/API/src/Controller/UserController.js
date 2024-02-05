const userService = require('../Services/UserService');
const userModel = require('../ORM/Models/User');
const userAuthModel = require('../ORM/Models/UserAuth');

const loginAuth = async (req, res) => {
    try{
        const userAuth = new userAuthModel();
        userAuth.constructFromJson(req.body);
        
        let result = await userService.getValueLogin(userAuth.loginOrEmail);
        
        if (result){
            result = await userService.getValueEmail(userAuth.loginOrEmail);
        }
        const real_result = result[0];

        if (real_result.Password != userAuth.encodedPassword){
            throw {"status": "wrong password"};
        }
        res.status(200).json({"status":"Successfull login!"});
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

module.exports = {
    loginAuth,
    register,
}
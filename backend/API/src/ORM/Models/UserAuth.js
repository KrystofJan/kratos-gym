class UserAuth {
    constructor(jsonData){
        this.loginOrEmail = jsonData.LoginOrEmail;
        this.encodedPassword = (jsonData.EncodedPassword) ? jsonData.EncodedPassword : '';
    }
}

module.exports = UserAuth;
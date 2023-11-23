class NoTableSelectedError{
    constructor(model){
        this.error = new Error('There is no selected error in this model!', model);   
    }
}
module.exports = NoTableSelectedError;
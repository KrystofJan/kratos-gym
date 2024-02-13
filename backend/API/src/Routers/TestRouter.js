
const express = require('express');
const testDAO = require('../ORM/AccessModels/TestDAO');

const Test = express.Router();

Test.get('/', async (req, res) => {
    try{
        const result = await new testDAO().getAll();
        res.status(200).json(result);
    }
    catch(error){
        console.log("Nastala chyba: " + error);
    }
});

Test.get('/:id', async (req, res) => {
    try{
        const result = await new testDAO().getId(req.params['id']);
        res.status(200).json(result);
    }
    catch(error){
        console.log("Nastala chyba: " + error);
    }
});

Test.post('/', async (req, res) => {
    try{
        const result = await new testDAO().post(req.body);
        console.log(result);
        res.status(200).json(result);
    }
    catch(error){
        console.log("Nastala chyba: " + error);
    }
});

module.exports = Test;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { TestDAO } from '../DataLayer/AccessModels/TestDAO.js';
export const Test = express.Router();
Test.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new TestDAO().getAll();
        res.status(200).json(result);
    }
    catch (error) {
    }
}));
Test.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new TestDAO().getId(parseInt(req.params['id']));
        res.status(200).json(result);
    }
    catch (error) {
    }
}));
Test.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield new TestDAO().post(req.body);
        res.status(200).json(result);
    }
    catch (error) {
    }
}));

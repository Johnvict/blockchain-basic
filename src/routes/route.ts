import { blockchainCtrl } from "./../controllers/class-exporter"
import express from 'express';
export const Router = express.Router();

Router.get('/', (req, res, next) => 
    res.json({
        status: "OK",
        code: "00",
        message: "Hola! Blockchain Basic is working fine. Make a POST request to /create-hash with following data",
        data: { message: "Some sample message texts"}
    }))
Router.post('/create-hash', (req, res, next) => blockchainCtrl.processMessageLog(req, res, next))

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const class_exporter_1 = require("./../controllers/class-exporter");
const express_1 = __importDefault(require("express"));
exports.Router = express_1.default.Router();
exports.Router.get('/', (req, res, next) => res.json({
    status: "OK",
    code: "00",
    message: "Hola! Blockchain Basic is working fine. Make a POST request to /create-hash with following data",
    data: { message: "Some sample message texts" }
}));
exports.Router.post('/create-hash', (req, res, next) => class_exporter_1.blockchainCtrl.processMessageLog(req, res, next));

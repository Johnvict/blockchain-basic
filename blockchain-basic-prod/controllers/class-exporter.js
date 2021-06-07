"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockchainCtrl = exports.logger = void 0;
const Blockchain_1 = require("./Blockchain");
const Logger_1 = require("./Logger");
exports.logger = new Logger_1.Logger();
exports.blockchainCtrl = new Blockchain_1.Blockchain();

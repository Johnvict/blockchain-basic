"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const crypto = __importStar(require("crypto"));
const class_exporter_1 = require("./class-exporter");
class Blockchain {
    constructor() {
        this.logger = class_exporter_1.logger;
        this.message = "";
        this.mostRecentBlock = { hash: "", message: "", nonce: 0 };
        console.log("BLOCKCHAIN CLASS IS INSTANTIATED");
        this.onInit();
    }
    /**
     * ! This function initializes the initial hash. It is called WHEN OUR APP STARTS
     * ! So it never gets called again until next "app restart"
     *
     * TODO -------------------------------------------------------------
     * We might want to avoid this behaviour in a real life scenario
     * because we only want this to happen when OUR APP starts to run.
     * Therefore, we would always want to check our log file first,
     * to know if there is a previous hash then we save it in A CACHE SUCH AS REDIS till
     * next restart again when we'll redo this operation to get last log
     * TODO -------------------------------------------------------------
     */
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("onInit CALLED");
            class_exporter_1.logger.getLastBlock.then((val) => (this.mostRecentBlock = val));
        });
    }
    processMessageLog(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            this.message = req.body.message;
            if (!this.mostRecentBlock.hash) {
                console.log("LAST BLOCK NOT KNOWN");
                this.onInit();
            }
            yield this.onInit();
            yield this.logBlock();
            return res.json({
                status: "OK",
                code: "00",
                message: "Data has been logged successfully",
            });
        });
    }
    /**
     * This method handles writing data into our log file
     * @param isInitial (Boolean) - To specify if this is a call from the initial app start
     * @returns
     */
    logBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            // Hash the message then call Logger to log it into csv file
            return this.hashMessage().then((_) => (this.logger.writeNewBlock = this.mostRecentBlock));
        });
    }
    /**
     * This method computes our hash
     * @returns Promise<MessageBlock | Error>
     */
    hashMessage() {
        return new Promise((resolve, reject) => {
            const computeHash = (nonce) => {
                let hash = crypto
                    .createHash("sha256")
                    .update(`${this.mostRecentBlock.hash},${this.message},${nonce}`, "utf8")
                    .digest("hex")
                    .toString();
                // Let us ne sure if our hash is valid before we finally log it
                if (this.hashIsValid(hash)) {
                    console.log("We got a valid hash now:", `${hash},${this.mostRecentBlock.message},${nonce}`);
                    // We want to keep this in memory so that we can reuse it next time when another request comes
                    // If it is not found in memory, we can be sure that we'll fetch it again from our log file
                    this.mostRecentBlock = { hash, message: this.message, nonce };
                    return resolve(this.mostRecentBlock);
                }
                process.nextTick(function () {
                    computeHash(nonce + 1);
                });
            };
            computeHash(0);
        });
    }
    hashIsValid(hash) {
        return hash.substring(0, 2) === "00";
    }
}
exports.Blockchain = Blockchain;

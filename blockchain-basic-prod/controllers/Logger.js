"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const json2csv_1 = __importDefault(require("json2csv"));
class Logger {
    constructor() {
        this.json2csv = json2csv_1.default.parse;
        console.log("LOGGER CLASS IS INSTANTIATED");
    }
    /**
     * We check our log file if we already have a loG or we
     * create an initial random hash made up of 64 zeros
     * @returns Promise<MessageBlock>
     */
    get getLastBlock() {
        console.log("GET LAST BLOCK IS BEING CALLED");
        return new Promise((resolve, reject) => {
            let lastBlockLoaded;
            if (!fs_1.default.existsSync(this.fileName)) {
                lastBlockLoaded = {
                    hash: Array(65).join("0"),
                    message: "random",
                    nonce: 0,
                };
                console.log("No previous log data found, we'll initialize this:", lastBlockLoaded);
                return this.writeToFile(lastBlockLoaded).then((_) => resolve(lastBlockLoaded));
            }
            fs_1.default.createReadStream(this.fileName)
                .pipe(csv_parser_1.default())
                .on("data", (row) => lastBlockLoaded = row)
                .on("end", () => {
                console.log("Last Block loaded");
                console.table(lastBlockLoaded);
                if (!lastBlockLoaded) {
                    //   WE DID NOT HAVE A LOG YET, SO WE WRITE A DEFAULT LOG
                    lastBlockLoaded = {
                        hash: Array(65).join("0"),
                        message: "random",
                        nonce: 0,
                    };
                    console.log("No previous log data found, we'll initialize this:", lastBlockLoaded);
                    this.writeToFile(lastBlockLoaded).then((_) => resolve(lastBlockLoaded));
                }
                else {
                    return resolve(lastBlockLoaded);
                }
            });
        });
    }
    /**
     * This method is deliberately exposed to the outside world (public)
     * It takes out newly encrypted data and passes control into
     * where we handle its logging into our log file
     */
    set writeNewBlock(dataBlock) {
        this.writeToFile(dataBlock);
    }
    /**
     * This method creates a file name for our log file such that it uses today's date as the file name
     * i.e    log-06-05-2021.csv
     */
    get fileName() {
        const today = new Date(), formatValue = (value) => (value < 10 ? `0${value}` : `${value}`), // To return a leading zero for values below 10
        fileName = `log-${formatValue(today.getMonth() + 1)}-${formatValue(today.getDate())}-${today.getFullYear()}.csv`;
        return path_1.default.join(__dirname, "/./../../logs", `${fileName}`);
    }
    /**
     *  This method writes our log data (the hash, message and nonce) into log file
     * @param data MessageBlock[]
     */
    writeToFile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows, fileName = this.fileName;
            // If file doesn't exist, we will create new file and add rows with headers.
            if (!fs_1.default.existsSync(this.fileName)) {
                rows = this.json2csv([data], { header: true });
            }
            else {
                // Rows without headers.
                rows = this.json2csv([data], { header: false });
            }
            // We want to write our new hash into log file
            fs_1.default.appendFile(fileName, rows, () => {
                console.log("Done writing to file");
                fs_1.default.appendFile(fileName, "\r\n", () => console.log("Done writing end of line to file"));
            });
        });
    }
}
exports.Logger = Logger;

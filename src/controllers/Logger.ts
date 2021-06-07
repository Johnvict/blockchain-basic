import csv from "csv-parser";
import fs from "fs";
import path from "path";
import json2csv from "json2csv";

import { MessageBlock } from "./../interfaces/interface";


export class Logger {
  private json2csv = json2csv.parse;

  constructor() {
      console.log("LOGGER CLASS IS INSTANTIATED");
  }

  /**
   * We check our log file if we already have a loG or we 
   * create an initial random hash made up of 64 zeros
   * @returns Promise<MessageBlock>
   */
  get getLastBlock(): Promise<MessageBlock> {
    console.log("GET LAST BLOCK IS BEING CALLED");
    return new Promise((resolve, reject) => {
      let lastBlockLoaded: MessageBlock;
      if (!fs.existsSync(this.fileName)) {
        lastBlockLoaded = {
          hash: Array(65).join("0"),
          message: "random",
          nonce: 0,
        };

        console.log("No previous log data found, we'll initialize this:", lastBlockLoaded);
        return this.writeToFile(lastBlockLoaded).then((_) => resolve(lastBlockLoaded));
      }
      fs.createReadStream(this.fileName)
        .pipe(csv())
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
          } else {
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
  set writeNewBlock(dataBlock: MessageBlock) {
    this.writeToFile(dataBlock);
  }

  /**
   * This method creates a file name for our log file such that it uses today's date as the file name
   * i.e    log-06-05-2021.csv
   */
  private get fileName(): string {
    const today = new Date(),
      formatValue = (value) => (value < 10 ? `0${value}` : `${value}`), // To return a leading zero for values below 10
      fileName = `log-${formatValue(today.getMonth() + 1)}-${formatValue(
        today.getDate()
      )}-${today.getFullYear()}.csv`;

    return path.join(__dirname, "/./../../logs", `${fileName}`);
  }

  /**
   *  This method writes our log data (the hash, message and nonce) into log file
   * @param data MessageBlock[]
   */
  private async writeToFile(data: MessageBlock) {
    let rows,
      fileName = this.fileName;

      // If file doesn't exist, we will create new file and add rows with headers.
      if (!fs.existsSync(this.fileName)) {
        rows = this.json2csv([data], { header: true });
    } else {
      // Rows without headers.
      rows = this.json2csv([data], { header: false });
    }

    // We want to write our new hash into log file
    fs.appendFile(fileName, rows, () => {
      console.log("Done writing to file");
      fs.appendFile(fileName, "\r\n", () => console.log("Done writing end of line to file"));
    });
  }
}

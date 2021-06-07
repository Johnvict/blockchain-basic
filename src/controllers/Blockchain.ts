import * as crypto from "crypto";
import { MessageBlock } from "../interfaces/interface";
import { logger } from "./class-exporter";
import { Logger } from "./Logger";

export class Blockchain {
  private logger: Logger = logger;
  private message: string = "";
  private mostRecentBlock: MessageBlock = { hash: "", message: "", nonce: 0 };

  constructor() {
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
  private async onInit() {
    console.log("onInit CALLED");
    logger.getLastBlock.then((val) => (this.mostRecentBlock = val));
  }

  async processMessageLog(req, res, next) {
    this.message = req.body.message;

    if (!this.mostRecentBlock.hash) {
      console.log("LAST BLOCK NOT KNOWN");
      this.onInit();
    }

    await this.onInit();
    await this.logBlock();
    return res.json({
      status: "OK",
      code: "00",
      message: "Data has been logged successfully",
    });
  }

  /**
   * This method handles writing data into our log file
   * @param isInitial (Boolean) - To specify if this is a call from the initial app start
   * @returns
   */
  private async logBlock() {
    // Hash the message then call Logger to log it into csv file
    return this.hashMessage().then(
      (_) => (this.logger.writeNewBlock = this.mostRecentBlock)
    );
  }

  /**
   * This method computes our hash
   * @returns Promise<MessageBlock | Error>
   */
  private hashMessage(): Promise<MessageBlock | Error> {
    return new Promise((resolve, reject) => {
      const computeHash = (nonce) => {
        let hash = crypto
          .createHash("sha256")
          .update(
            `${this.mostRecentBlock.hash},${this.message},${nonce}`,
            "utf8"
          )
          .digest("hex")
          .toString();

        // Let us ne sure if our hash is valid before we finally log it
        if (this.hashIsValid(hash)) {
          console.log(
            "We got a valid hash now:",
            `${hash},${this.mostRecentBlock.message},${nonce}`
          );

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

  private hashIsValid(hash: string) {
    return hash.substring(0, 2) === "00";
  }
}

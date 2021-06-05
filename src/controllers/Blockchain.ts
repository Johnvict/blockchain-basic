import * as crypto from "crypto";
import { MessageBlock } from "../interfaces/interface";

export class Blockchain {
  message = "random";
  lastBlock: MessageBlock = {
    hash: Array(65).join('0'),  // To create an initial random hash made up of 64 zeros
    message: 'random',
    nonce: 0
  };
  blocks: any[] = [];

  constructor() {
    console.log("Blockchain CONSTRUCTOR is called:", this.lastBlock);
    this.onInit();
  }

  /**
   * ! This function initializes the initial hash. It is called WHEN OUR APP STARTS
   * ! So it never gets called again until the next app restarts
   * 
   * TODO -------------------------------------------------------------
   * We might want to avoid this behaviour in a real life scenario
   * because we only want this to happen when OUR APP runs for the 
   * first time ONLY in "forever". Therefore, we would always want to
   * check our log file first, to know if there is a previous hash 
   * TODO -------------------------------------------------------------
   * @returns Function
   * 
   */
  async onInit() {
    console.log("onInit CALLED")
    return this.logBlock(true);
  }

  /**
   * This method handles writing data into our log file
   * @param isInitial (Boolean) - To specify if this is a call from the initial app start
   * @returns 
   */
  async logBlock(isInitial?: boolean) {
    const saveToFIle = () => {
      // TODO - Log data into csv file
      this.blocks.push(this.lastBlock);
    }
    if (isInitial) return saveToFIle();
    return this.hashMessage().then((hash) => saveToFIle());
  }

  /**
   * This method computes our hash
   * @returns Promise<MessageBlock | Error>
   */
  hashMessage(): Promise<MessageBlock | Error> {
    return new Promise((resolve, reject) => {
      const computeHash = (nonce) => {
        let hash = crypto
          .createHash("sha256")
          .update(`${this.lastBlock.hash},${this.message},${nonce}`, "utf8")
          .digest("hex")
          .toString();

          // Validate hash before we finally log it
        if (this.hashIsValid(hash)) {
          console.log("We got a valid had now:", `${hash},${this.lastBlock.message},${nonce}`)
          this.lastBlock =  {hash, message: this.message, nonce};
          return resolve(this.lastBlock);
        }

        process.nextTick(function () {
          computeHash(nonce + 1);
        });
      };

      computeHash(0);
    });
  }

  hashIsValid(hash: string) {
    return hash.substring(0, 2) === "00";
  }

  returnSomething(req, res, next) {
    this.message = req.body.message;   
    this.logBlock()
      .then(() => {
        // TODO - Get the last block from our csv file then use it
        this.lastBlock = this.lastBlock // will still change
      })

      .then(() => {
        const hash = this.blocks;
        return res.json({ hash, length: hash.length });
      });
  }
}

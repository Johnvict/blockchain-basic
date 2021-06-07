"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = require("./routes/route");
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/", route_1.Router);
app.get("*", (req, res) => res.redirect("/"));
const port = 3000;
app.listen(port, () => console.log(`Blockchain Basic is running on http://localhost:${port} 😁`));

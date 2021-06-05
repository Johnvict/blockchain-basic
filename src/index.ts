import express from "express";
import { Router } from "./routes/route";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/", Router);
app.get("*", (req, res) => res.redirect("/"));


const port = 3000;
app.listen(port, () =>
  console.log(`Blockchain Basic is running on http://localhost:${port} 😁`)
);

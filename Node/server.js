import "colors";
import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { router } from "./routes.js";

const app = express();
app.use(cors());
app.use(router);

app.listen(config.port || 3000, () => console.log(`Server running`.green));

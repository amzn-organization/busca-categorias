const serverless = require("serverless-http");
require("colors");
const cors = require("cors");
const express = require("express");
const { config } = require("./config.js");
const { router } = require("./routes.js");

const app = express();
app.use(cors());
app.use(router);

// app.listen(config.port || 3000, () => console.log(`Server running`.green));
module.exports.handler = serverless(app);

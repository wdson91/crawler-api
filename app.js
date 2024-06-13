const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const fs = require("fs");

const app = express();
const port = 3000;
require("dotenv").config();
// Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const crawlerRoutes = require("./src/routes/routes");
app.use(crawlerRoutes);

app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});

require("./src/database/mongo/conn");
require("./src/database/postgre/connect");

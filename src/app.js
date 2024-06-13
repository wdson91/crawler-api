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
// Simulate a database with JSON file
const dbFilePath = "./db.json";

// Initialize the JSON file
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify([]));
}

// Routes
const crawlerRoutes = require("./routes/routes");
app.use(crawlerRoutes);

app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});

require("./database/conn");

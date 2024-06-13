const express = require("express");
const router = express.Router();
const crawlerController = require("../controllers/controller");
const mongo = require("../database/conn");

router.post("/coleta", crawlerController.createRequest);

// GET route to view crawler execution response
router.get("/coleta", crawlerController.getResponse);

// GET route to list all requests
router.get("/requests", crawlerController.getRequests);

//router.get("/data", mongo.getData);

module.exports = router;

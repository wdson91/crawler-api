const express = require("express");
const router = express.Router();
const crawlerController = require("../controllers/controller");
const mongo = require("../database/mongo/conn");

router.post("/coleta", crawlerController.createRequest);

// GET route to list all requests
router.get("/request", crawlerController.getAllRequests);
// GET route
router.get("/request/:id", crawlerController.getOneRequest);

//router.get("/data", mongo.getData);

module.exports = router;

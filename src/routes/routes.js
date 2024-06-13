const express = require("express");
const router = express.Router();
const crawlerController = require("../controllers/controller");
const mongo = require("../database/mongo/conn");

// Post route to start the crawler
router.post("/scrap", crawlerController.createRequest);

// GET route to list all requests
router.get("/request", crawlerController.getAllRequests);

// GET route
router.get("/request/:id", crawlerController.getOneRequest);

module.exports = router;

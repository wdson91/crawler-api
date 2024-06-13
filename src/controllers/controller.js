const fs = require("fs");
const dbFilePath = "./db.json";
const scraper = require("../services/crawlerService");
const { json } = require("body-parser");
const conn = require("../database/conn");
const organization = require("../models/organization");
// Helper function to read the database

// POST /coleta
exports.createRequest = async (req, res) => {
  const newRequest = {
    organization: req.body.organization,
    timestamp: new Date().toISOString(),
  };

  try {
    const data = await scraper.startCrawler(newRequest.organization);
    if (data.repositories === "erro") {
      return res.status(400).json("Organização não encontrada");
    }

    const org = await conn.insertData(data);

    res.status(200).json(org.id);
  } catch (error) {
    res.status(400).json("Organização não encontrada");
  }
};

// GET response
exports.getResponse = async (req, res) => {};

// GET requests
exports.getRequests = (req, res) => {
  const database = readDatabase();
  res.json(database);
};

const fs = require("fs");
const dbFilePath = "./db.json";
const scraper = require("../services/crawlerService");
const { json } = require("body-parser");
const connMongo = require("../database/mongo/conn");
const organization = require("../models/organization");
const connPostgre = require("../database/postgre/connect");

const { v4: uuidv4 } = require("uuid");

// POST Request
async function createRequest(req, res) {
  const newRequest = {
    id: uuidv4(),
    organization: req.body.organization,
    timestamp: new Date().toISOString(),
  };

  try {
    const data = await scraper.startCrawler(newRequest.organization);
    if (data.repositories === "erro") {
      return res.status(401).json("Organização não encontrada");
    }
    // Salvando no banco de dados MongoDB
    const org = await connMongo.insertData(data);
    // Salvando no banco de dados Postgres

    const org_log = await connPostgre.insertRequest(
      newRequest.id,
      org,
      newRequest.organization
    );

    res.status(200).json({ id: org });
  } catch (error) {
    res.status(400).json("Organização não encontrada");
  }
}

// GET Request by ID
async function getOneRequest(req, res) {
  const id = req.params.id;
  try {
    const org = await connMongo.getOneData(id);
    res.status(200).json(org);
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }
}

// GET All Requests
async function getAllRequests(req, res) {
  try {
    const requests = await connPostgre.getRequests();

    res.status(200).json(requests);
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }
}

module.exports = { createRequest, getOneRequest, getAllRequests };

const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const OrgData = require("../../models/organization");

const conn = () => {
  mongoose.connect("mongodb://mongodb:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("error", () => {
    console.log("Erro ao conectar ao banco de dados");
  });

  db.on("open", () => {
    console.log("Conectado ao banco de dados MongoDB");
  });
};

async function insertData(data) {
  try {
    const org = await OrgData.create({ data: data });

    return org._id;
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
  }
}

async function getAllData() {
  try {
    const data = await OrgData.find();

    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }
}

async function getOneData(id) {
  try {
    const data = await OrgData.findById(id);

    return data.data;
  } catch (error) {
    console.error("Erro ao buscar os dados:", error);
  }
}

conn();

module.exports = { mongoose, insertData, getAllData, getOneData };

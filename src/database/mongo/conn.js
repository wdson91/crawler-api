const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const OrgData = require("../../models/organization");

const conn = () => {
  mongoose.connect(process.env.MONGO_URI);

  const db = mongoose.connection;

  db.on("error", () => {
    console.log("Error connecting to MongoDB!");
  });

  db.on("open", () => {
    console.log("Connected to MongoDB!");
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
    console.error("Error", error);
  }
}

async function getOneData(id) {
  try {
    const data = await OrgData.findById(id);

    return data.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

conn();

module.exports = { mongoose, insertData, getAllData, getOneData };

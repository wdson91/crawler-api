const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});
async function connect() {
  if (global.connection) return global.connection.connect();

  try {
    const client = await pool.connect();
    console.log("Conectado ao banco de dados Postgres!");
    // Your database query logic here
    client.release();
  } catch (err) {
    console.error("Database connection error:", err);
    // Log the stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err);
    }
  }
}

async function createTable() {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS requests (
        id VARCHAR(100) PRIMARY KEY,
        id_mongo VARCHAR(100) NOT NULL,
        organization VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    console.log("Conectado ao banco de dados Postgres!");
    client.release();
  } catch (err) {
    console.error("Error creating table:", err);
    // Log the stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err);
    }
  }
}

async function insertRequest(id, idMongo, organization) {
  const insertQuery = `
      INSERT INTO requests (id,id_mongo, organization)
      VALUES ($1, $2,$3)
      RETURNING *;
    `;
  try {
    const client = await pool.connect();
    const res = await client.query(insertQuery, [id, idMongo, organization]);

    client.release();
  } catch (err) {
    console.error("Error inserting request:", err);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err);
    }
  }
}

async function getRequests() {
  const selectQuery = "SELECT * FROM requests;";
  try {
    const client = await pool.connect();
    const res = await client.query(selectQuery);

    client.release();
  } catch (err) {
    console.error("Error querying requests:", err);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err);
    }
  }
}

async function getRequestById(idMongo) {
  const selectQuery = `
      SELECT * FROM requests
      WHERE id_mongo = $1;
    `;
  try {
    const client = await pool.connect();
    const res = await client.query(selectQuery, [idMongo]);
    if (res.rows.length > 0) {
      console.log("Request found:", res.rows[0]);
    } else {
      console.log("Request not found");
    }
    client.release();
  } catch (err) {
    console.error("Error querying request:", err);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err);
    }
  }
}
createTable();

module.exports = {
  connect,
  insertRequest,
  getRequests,
  getRequestById,
};

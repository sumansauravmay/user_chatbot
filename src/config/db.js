const { Client } = require("pg");
require("dotenv").config();

const connection = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectToDatabase = async () => {
  try {
    await connection.connect();
    console.log("Connected to the database successfully");
  } catch (err) {
    console.error("Database connection failed:", err.stack);
    process.exit(1); // Stop the app if DB fails
  }
};

module.exports = { connection, connectToDatabase };

import pg from "pg";
// import { config } from "dotenv";

// config();

// const { Pool } = pg;

// const PORT = parseInt(process.env.DB_PORT || "5432", 10);

// const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD_ENCRYPTED}@${process.env.DB_HOST}:${PORT}/${process.env.DB_NAME}`;
// const db = new Pool({
//   connectionString: DATABASE_URL,
// });

// db.on("connect", () => {
//   console.log("Database connected successfully!");
// });

// db.on("error", (err) => {
//   console.error("Database connection error:", err.stack);
// });

// export default db;
import knex from "knex";
import { config } from "dotenv";

config();

const PORT = parseInt(process.env.DB_PORT || "5432", 10);

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD_ENCRYPTED,
    database: process.env.DB_NAME,
    port: PORT,
  },
});

export default db;

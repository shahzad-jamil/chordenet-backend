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
  pool: { min: 2, max: 10 }, 
});

const checkDatabaseConnection = async () => {
  try {
    await db.raw("SELECT 1+1 AS result"); 
    console.log(`Database connected successfully on port ${PORT}`);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); 
  }
};

// Run the connection check when the project starts
checkDatabaseConnection();

export default db;

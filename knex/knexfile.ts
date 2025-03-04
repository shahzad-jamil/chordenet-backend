import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env") });

const knexConfig = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "chordenet",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    port: parseInt(process.env.DB_PORT || "5440", 10),
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

export default knexConfig;

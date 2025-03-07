// import dotenv from "dotenv";
// dotenv.config();

// const allowedOrigins: string[] = [
//   process.env.FRONTEND_URL ?? "", 
//   process.env.BASE_URL ?? "",
//   process.env.ADMIN_BASE_URL ?? "",
// ].filter(origin => origin.trim() !== ""); 

// const corsOptions = {
//   origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   credentials: true,
// };

// export default corsOptions;
import cors from "cors";

const corsOptions = {
  origin: "*", // ⚠️ Allow all origins (Not recommended for production)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies/auth headers
  optionsSuccessStatus: 200,
};

export default corsOptions;

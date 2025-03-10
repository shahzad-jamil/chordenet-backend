import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { morganConfig } from "./config/morgan";
import corsOptions from "./config/cors";
import Routes from "./routes";
import "./config/db"; 

const app: Express = express();

dotenv.config();

morganConfig(app);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));

const port = process.env.PORT || 8000;

app.use("/api/v1", Routes);

app.get("/", async (req: Request, res: Response) => {
  res.send("Server running...");
});

app.use((req: Request, res: Response) => {
  res
    .status(404)
    .json({ status: 404, success: false, message: "Route not found" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

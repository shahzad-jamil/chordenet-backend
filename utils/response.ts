import { Response } from "express";
import fs from "fs";

export const response = (res: Response, status: number, message: string) => {
  let success = false;
  if (status == 200 || status == 201) {
    success = true;
  }
  return res.status(status).json({ status, success, message });
};
export const responseData = (
  res: Response,
  status: number,
  message: string,
  data: any
) => {
  let success = false;
  if (status == 200 || status == 201) {
    success = true;
  }
  return res.status(status).json({ status, success, message, data });
};

export const errorResponse = (res: Response, message: string) => {
  return res.status(400).json({ status: 400, success: false, message });
};
export const errorCatchResponse = (res: Response, message: string) => {
  errorLogger(message);
  return res.status(500).json({ status: 500, success: false, message });
};

const errorLogger = (err: any) => {
  const logFilePath = "error.log";
  if (!fs.existsSync(logFilePath)) {
    fs.closeSync(fs.openSync(logFilePath, "w"));
  }
  fs.appendFile(
    logFilePath,
    `${new Date().toISOString()} - ${err.stack}\n`,
    (error) => {
      if (error) {
        console.error("Error writing to error log:", error);
      }
    }
  );
};

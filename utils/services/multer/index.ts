const multer = require("multer");
import fs from "fs";
import { Request } from "express";
export const storageData = (name: string) => {
  const storage = multer.diskStorage({
    destination: (req: Request, file: File, cb: CallableFunction) => {
      const path = `public/${name}`;
      try {
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
      } catch (err: any) {
        cb(err.message, null);
      }
    },
    filename: (
      req: Request,
      file: { originalname: string },
      cb: CallableFunction
    ) => {
      const name =
        typeof file.originalname === "string"
          ? file.originalname.replace(/[^\w.]/g, "_")
          : file.originalname;
      cb(null, Date.now() + "-" + name);
    },
  });
  const upload = multer({ storage });

  return upload;
};

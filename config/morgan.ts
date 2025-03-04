import { Request, Response } from "express";
import morgan from "morgan";

export const morganConfig = (app: any) => {
  morgan.token("host", function (req: Request, res: Response) {
    return req.hostname;
  });
  app.use(
    morgan(
      ":method :host :url :status :res[content-length] - :response-time ms"
    )
  );
};

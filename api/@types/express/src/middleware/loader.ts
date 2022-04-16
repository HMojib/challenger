import { Request, Response, NextFunction } from "express";
import createLoaders from "../loaders";

export const createDataLoaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.loaders = createLoaders();
  return next();
};

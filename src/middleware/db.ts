import { withAuthPgClient, withPgClient, User } from "../db";
import { Request, Response, NextFunction } from "express";

export const pgClientWithContext = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User;
  const userId = user?.id;

  next();
};

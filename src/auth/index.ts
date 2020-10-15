import passport from "passport";

import { Request, Response, NextFunction } from "express";

export * from "./oauth";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ message: "You must be logged in to access this route" });
};

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user);
});

passport.deserializeUser((user, done) => {
  done(undefined, user);
});

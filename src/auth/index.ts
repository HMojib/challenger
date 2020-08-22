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
  console.log("SERIALIZE: ", user);
  done(undefined, user);
});

passport.deserializeUser((user, done) => {
  console.log("DESERIALIZE: ", user);

  done(undefined, user);
});

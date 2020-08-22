import express from "express";
import cookieParser from "cookie-parser";
import { session as sessionConfig } from "./config";
import routes from "./routes";
import passport from "passport";
import { pgPool } from "./db";
import * as auth from "./auth";

import session from "express-session";
import connectSession from "connect-pg-simple";

const pgSession = connectSession(session);

const app = express();

app.use(cookieParser(sessionConfig.secret));

app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      schemaName: "users",
    }),
    ...sessionConfig,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);

app.get("/", auth.isAuthenticated, (req, res) => {
  res.status(200).send("Hello Foo!");
});

app.listen(8000, () => {
  console.log("Server Started at Port, 8000");
});

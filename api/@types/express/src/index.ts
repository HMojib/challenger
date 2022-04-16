import express, { Request } from "express";
import { graphqlHTTP } from "express-graphql";
import cookieParser from "cookie-parser";
import routes from "./routes";
import passport from "passport";
import { pgPool } from "./db";
import * as auth from "./auth";
import schema from "./graphql";
import { Context } from "./graphql/context";
import { app as appConfig, session as sessionConfig } from "./config";
import session from "express-session";
import connectSession from "connect-pg-simple";
import { createDataLoaders } from "./middleware";

const app = express();

app.use(cookieParser(sessionConfig.secret));

const pgSession = connectSession(session);

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

app.use(createDataLoaders);

app.use(
  "/graphql",
  graphqlHTTP(async (req) => ({
    schema,
    context: new Context(req as Request),
    graphiql: !appConfig.production,
    pretty: !appConfig.production,
  }))
);

app.use("/", routes);

app.get("/", auth.isAuthenticated, (req, res) => {
  res.status(200).send("Hello Foo!");
});

app.listen(8000, () => {
  console.log("Server Started at Port, 8000");
});

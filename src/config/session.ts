import { app as appConfig } from "./app";

export interface SessionCookieConfig {
  sameSite: boolean;
  domain: string | undefined;
  secure: boolean;
  httpOnly: boolean;
  maxAge: number;
}

export interface SessionConfig {
  secret: string;
  saveUninitialized: boolean;
  resave: boolean;
  cookie: SessionCookieConfig;
}

export const session: SessionConfig = {
  secret: process.env.SESSION_SECRET || "challenger",
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: true,
    domain: appConfig.production ? appConfig.domain : undefined,
    secure: appConfig.production,
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_AGE) || 7 * 24 * 60 * 60 * 1000,
  },
};

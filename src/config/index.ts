export * as auth from "./auth";

interface AppConfig {
  domain: string;
  production: boolean;
}

export const app: AppConfig = {
  domain: process.env.DOMAIN || "localhost:8000",
  production: process.env.NODE_ENV === "production",
};

export const session = {
  secret: process.env.SESSION_SECRET || "challenger",
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: true,
    domain: app.production ? app.domain : undefined,
    secure: app.production,
    httpOnly: true,
    maxAge: Number(process.env.COOKIE_AGE) || 7 * 24 * 60 * 60 * 1000,
  },
};

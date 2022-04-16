import { StrategyOptionsWithRequest } from "passport-google-oauth20";

const google: StrategyOptionsWithRequest = {
  clientID: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  callbackURL: "/auth/google/callback",
  passReqToCallback: true,
};

export interface AuthConfig {
  google: StrategyOptionsWithRequest;
}

export const auth = {
  google,
};

export interface AppConfig {
  domain: string;
  production: boolean;
}

export const app: AppConfig = {
  domain: process.env.DOMAIN || "localhost:8000",
  production: process.env.NODE_ENV === "production",
};

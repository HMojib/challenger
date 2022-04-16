export interface DBConfig {
  maxResultSize: number;
  defaultResultSize: number;
  connectionString: string;
}

export const db: DBConfig = {
  maxResultSize: Number(process.env.MAX_RESULT_SIZE || 50),
  defaultResultSize: Number(process.env.DEFAULT_RESULT_SIZE || 5),
  connectionString:
    process.env.DATABASE_URL || "postgres://postgres@localhost:5432/challenger",
};

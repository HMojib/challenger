import pg, { PoolClient } from "pg";
//@ts-ignore
import pgCamelCase from "pg-camelcase";
import { db as dbConfig } from "../config";

export const revertCamelCase = pgCamelCase.inject(pg);

// TODO add logging and timing for each query on pool
export const pgPool = new pg.Pool({
  connectionString: dbConfig.connectionString,
});

pgPool.on("error", (err: Error, client: PoolClient) => {
  //TODO log error and reopen another connection
  console.log("pg pool error", err);
});

type WithAuthenticatedPgClientFunction = <T>(
  userId: string,
  cb: (pgClient: PoolClient) => Promise<T>
) => Promise<T>;

type WithPgClientFunction = <T>(
  cb: (pgClient: PoolClient) => Promise<T>
) => Promise<T>;

export const withAuthPgClient: WithAuthenticatedPgClientFunction = async (
  userId,
  cb
) => {
  const pgClient = await pgPool.connect();
  await pgClient.query("BEGIN");
  try {
    await pgClient.query("select set_config('user.id', $1, true)", [userId]);

    return await cb(pgClient);
  } finally {
    try {
      await pgClient.query("COMMIT");
    } finally {
      pgClient.release();
    }
  }
};

export const withPgClient: WithPgClientFunction = async (cb) => {
  const pgClient = await pgPool.connect();
  try {
    return await cb(pgClient);
  } finally {
    pgClient.release();
  }
};

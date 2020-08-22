import { Pool, PoolClient } from "pg";

export const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });

pgPool.on("error", (err: Error, client: PoolClient) => {
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
    await pgClient.query("set local user.id to $1", [userId]);

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

export interface User {
  id: string;
}

export interface Challenge {
  id: string;
  challengeSetId: string;
  startTime: Date;
  createdAt: Date;
  createdBy: string;
}

export interface ChallengeEvent {
  id: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

export interface ChallengeFrequency {
  id: string;
  challengeSetEventId: string;
  effectiveRange: DateRange;
}

export interface ChallengeSet {
  id: string;
  title: string;
  description: string;
  frequency: string;
  createdAt: Date;
  createdBy: string;
}

export interface ChallengeSetEvent {
  id: string;
  challengeSetId: string;
  challengeEventId: string;
  createdAt: Date;
  createdBy: string;
}

export interface ChallengeUser {
  userId: string;
  challengeId: string;
  voteId: Date;
}

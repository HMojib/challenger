import { batchChallengeTypeById, ChallengeType, pgPool } from "../db";

export const challengeType = async (
  keys: readonly number[]
): Promise<(ChallengeType | Error)[]> => {
  const pgClient = await pgPool.connect();
  const fields = ["tag", "title"];
  try {
    const challengeTypes = await batchChallengeTypeById(pgClient, keys, fields);

    const challengeTypeById = new Map(
      challengeTypes.map((challengeType) => [challengeType.id, challengeType])
    );

    return keys.map(
      (key) =>
        challengeTypeById.get(key) || new Error(`Challenge type not found`)
    );
  } catch (err) {
    return keys.map(() => err);
  } finally {
    pgClient.release();
  }
};

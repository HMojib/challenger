import { batchEventTypeById, EventType, pgPool } from "../db";

export const eventType = async (
  keys: readonly number[]
): Promise<(EventType | Error)[]> => {
  const pgClient = await pgPool.connect();
  const fields = ["tag", "title"];
  try {
    const eventTypes = await batchEventTypeById(pgClient, keys, fields);

    const eventTypeById = new Map(
      eventTypes.map((eventType) => [eventType.id, eventType])
    );

    return keys.map(
      (key) => eventTypeById.get(key) || new Error(`Event type not found`)
    );
  } catch (err) {
    return keys.map(() => err);
  } finally {
    pgClient.release();
  }
};

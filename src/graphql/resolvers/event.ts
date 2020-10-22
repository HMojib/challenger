import { GraphQLResolveInfo } from "graphql";
import { EventType } from "../types";
import { pgPool, getEventById } from "../../db";
import { resolveNodeFieldsFromNode } from "../utils";

export const eventById = async (id: string, info: GraphQLResolveInfo) => {
  const pgClient = await pgPool.connect();
  const fields = resolveNodeFieldsFromNode(info, EventType);
  try {
    return getEventById(pgClient, id, fields);
  } finally {
    pgClient.release();
  }
};

import { GraphQLResolveInfo } from "graphql";
import { EventType } from "../types";
import { pgPool, getEventById } from "../../db";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  ResolveTree,
} from "graphql-parse-resolve-info";

export const eventById = async (id: string, info: GraphQLResolveInfo) => {
  const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;
  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment,
    EventType
  );
  const pgClient = await pgPool.connect();

  try {
    return getEventById(
      pgClient,
      id,
      Object.keys(fields).filter((key) => key !== "id")
    );
  } finally {
    pgClient.release();
  }
};

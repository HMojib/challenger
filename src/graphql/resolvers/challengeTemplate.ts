import { GraphQLResolveInfo } from "graphql";
import { ChallengeTemplateType } from "../types";
import { pgPool, getChallengeTemplateById } from "../../db";
import { resolveNodeFieldsFromNode } from "../utils";

export const challengeTemplateById = async (
  id: string,
  info: GraphQLResolveInfo
) => {
  const pgClient = await pgPool.connect();
  const fields = resolveNodeFieldsFromNode(info, ChallengeTemplateType);
  try {
    return getChallengeTemplateById(pgClient, id, fields);
  } finally {
    pgClient.release();
  }
};

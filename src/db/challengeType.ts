import { PoolClient } from "pg";
import { ConnectionArguments } from "graphql-relay";
import { queryFromTableWithConnectionArgs, batchQueryTable } from "./utils";
import { Node } from "../graphql/types";

export interface ChallengeType {
  id: number;
  tag: string;
  title: string;
}

export interface ChallengeTypeNode extends Node {
  tag: string;
  title: string;
}

export const batchChallengeTypeById = async (
  pgClient: PoolClient,
  ids: readonly number[],
  fields: string[]
): Promise<ChallengeType[]> => {
  return batchQueryTable(
    pgClient,
    ids.concat(),
    fields,
    "challenger.challenge_type"
  );
};

export const getChallengeTypes = async (
  pgClient: PoolClient,
  args: ConnectionArguments,
  fields: string[]
): Promise<ChallengeTypeNode[]> => {
  return queryFromTableWithConnectionArgs(
    pgClient,
    args,
    "challenger.challenge_type",
    fields
  );
};

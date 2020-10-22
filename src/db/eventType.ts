import { PoolClient } from "pg";
import { ConnectionArguments } from "graphql-relay";
import { queryFromTableWithConnectionArgs, batchQueryTable } from "./utils";
import { Node } from "../graphql/types";

export interface EventType {
  id: number;
  tag: string;
  title: string;
}

export interface EventTypeNode extends Node {
  tag: string;
  title: string;
}

export const batchEventTypeById = async (
  pgClient: PoolClient,
  ids: readonly number[],
  fields: string[]
): Promise<EventType[]> => {
  return batchQueryTable(
    pgClient,
    ids.concat(),
    fields,
    "challenger.event_type"
  );
};

export const getEventTypes = async (
  pgClient: PoolClient,
  args: ConnectionArguments,
  fields: string[]
): Promise<EventTypeNode[]> =>
  queryFromTableWithConnectionArgs(
    pgClient,
    args,
    "challenger.event_type",
    fields
  );

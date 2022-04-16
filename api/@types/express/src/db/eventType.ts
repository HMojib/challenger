import { PoolClient } from "pg";
import { ConnectionArguments } from "graphql-relay";
import { queryFromTableWithConnectionArgs } from "./utils";
import { Node } from "../graphql/types";
import { snakeCase } from "lodash";

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
  const text = `
    SELECT ${["id", ...fields].map(snakeCase).join(",")} 
    FROM challenger.event_type 
    WHERE id = any ($1)`;
  const params = [ids];

  const { rows } = await pgClient.query(text, params);

  return rows;
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

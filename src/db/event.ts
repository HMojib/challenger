import { PoolClient } from "pg";
import { ConnectionArguments } from "graphql-relay";
import { queryFromTableWithConnectionArgs } from "./utils";
import { Node } from "../graphql/types";
import { snakeCase } from "lodash";

export interface PostgresInterval {
  seconds?: Number;
  minutes?: Number;
  hours?: Number;
  days?: Number;
  months?: Number;
  years?: Number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  frequency: PostgresInterval;
  startTime: string;
  createdAt: string;
  createdBy: string;
}

export interface NewEvent {
  title: string;
  description: string;
  frequency: string;
  startTime: string;
  createdAt: string;
  createdBy: string;
}

export interface UpdateEvent {
  [key: string]: string | undefined;
  title?: string;
  description?: string;
  frequency?: string;
  startTime?: string;
}

export interface EventNode extends Node {
  title: string;
  description: string;
  frequency: string;
  startTime: string;
  createdAt: string;
  createdBy: string;
}

export const insertEvent = async (
  pgClient: PoolClient,
  event: NewEvent
): Promise<Event> => {
  const {
    title,
    description,
    frequency,
    startTime,
    createdAt,
    createdBy,
  } = event;

  const text = `
    INSERT INTO challenger.event (title, description, frequency, start_time, created_at, created_by) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING id
    `;

  const params = [
    title,
    description,
    frequency,
    startTime,
    createdAt,
    createdBy,
  ];

  const {
    rows: [row],
    rowCount,
  } = await pgClient.query(text, params);

  if (rowCount === 1) {
    return row;
  } else {
    throw new Error("Unable to create new Event");
  }
};

export const updateEventById = async (
  pgClient: PoolClient,
  id: string,
  event: UpdateEvent
): Promise<Event> => {
  const fields = Object.keys(event);

  const updates = fields.map(
    (field, index) => `${snakeCase(field)}=$${index + 2}`
  );

  const updateParams = fields.map((field) => event[field]);

  const text = `
  UPDATE challenger.event 
  SET ${updates.join(",")} 
  WHERE id = $1 
  RETURNING id`;

  const params = [id, ...updateParams];

  const {
    rows: [row],
    rowCount,
  } = await pgClient.query(text, params);

  if (rowCount === 1) {
    return row;
  } else {
    throw new Error("Unable to update Event");
  }
};

export const getEventById = async (
  pgClient: PoolClient,
  id: string,
  fields: string[]
): Promise<Event> => {
  const text = `
  SELECT id, ${fields.map(snakeCase).join(",")} 
  FROM challenger.event 
  WHERE id = $1`;
  const params = [id];

  const {
    rows: [row],
  } = await pgClient.query(text, params);

  return row;
};

export const getEvents = async (
  pgClient: PoolClient,
  args: ConnectionArguments,
  fields: string[]
): Promise<EventNode[]> =>
  queryFromTableWithConnectionArgs(pgClient, args, "challenger.event", fields);

export const deleteEventById = async (
  pgClient: PoolClient,
  id: string
): Promise<Event> => {
  const text = `
  DELETE FROM challenger.event 
  WHERE id = $1
  RETURNING id`;
  const params = [id];

  const {
    rows: [row],
  } = await pgClient.query(text, params);

  return row;
};

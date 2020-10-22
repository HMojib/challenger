import { PoolClient } from "pg";
import { ConnectionArguments } from "graphql-relay";
import { snakeCase } from "lodash";

import { queryFromTableWithConnectionArgs, getRecordById } from "./utils";
import { Node } from "../graphql/types";
import e from "express";

export interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  challengeType: number;
}

export interface ChallengeTemplateNode extends Node {
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  challengeType: number;
}

export interface NewChallengeTemplate {
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  challengeType: number;
}

export interface UpdateChallengeTemplate {
  [key: string]: string | number | undefined;
  title: string;
  description: string;
  challengeType: number;
}

export const getChallengeTemplates = (
  pgClient: PoolClient,
  args: ConnectionArguments,
  fields: string[]
): Promise<ChallengeTemplateNode[]> => {
  return queryFromTableWithConnectionArgs(
    pgClient,
    args,
    "challenger.challenge_template",
    fields
  );
};

export const getChallengeTemplateById = async (
  pgClient: PoolClient,
  id: string,
  fields: string[]
): Promise<ChallengeTemplate> => {
  return getRecordById(pgClient, id, fields, "challenger.challenge_template");
};

export const insertChallengeTemplate = async (
  pgClient: PoolClient,
  challengeTemplate: NewChallengeTemplate
): Promise<ChallengeTemplate> => {
  const text = `
    INSERT INTO challenger.challenge_template (title, description, created_at, created_by, challenge_type) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id
    `;
  const {
    title,
    description,
    createdAt,
    createdBy,
    challengeType,
  } = challengeTemplate;
  const params = [title, description, createdAt, createdBy, challengeType];

  try {
    const {
      rows: [row],
    } = await pgClient.query(text, params);

    return row;
  } catch (err) {
    if (err.code === "23503") {
      throw new Error("Challenge type does not exist");
    } else {
      throw new Error("Unable to create new event");
    }
  }
};

export const updateChallengeTemplateById = async (
  pgClient: PoolClient,
  id: string,
  challengeTemplate: UpdateChallengeTemplate
): Promise<ChallengeTemplate> => {
  const fields = Object.keys(challengeTemplate);

  const updates = fields.map(
    (field, index) => `${snakeCase(field)}=$${index + 2}`
  );

  const updateParams = fields.map((field) => challengeTemplate[field]);

  const text = `
    UPDATE challenger.challenge_template 
    SET ${updates.join(",")} 
    WHERE id = $1 
    RETURNING id`;

  const params = [id, ...updateParams];

  try {
    const {
      rows: [row],
    } = await pgClient.query(text, params);

    return row;
  } catch (err) {
    if (err.code === "23503") {
      throw new Error("Challenge type does not exist");
    } else {
      throw new Error("Unable to update event");
    }
  }
};

import { ConnectionArguments } from "graphql-relay";
import { db as dbConfig } from "../config";
import { fromGlobalId } from "../utils";
import { PoolClient } from "pg";
import { snakeCase } from "lodash";

const { maxResultSize, defaultResultSize } = dbConfig;

interface WhereFromArgs {
  whereClause: string;
  whereParams: string[];
}

export const getWhereFromArgs = (args: ConnectionArguments): WhereFromArgs => {
  const { after, before } = args;
  let whereParams = [];
  let whereClause = "";

  if (after && before) {
    throw new Error("Cannot use after and before");
  } else if (after) {
    const id = fromGlobalId(after, "Event");
    whereClause = "WHERE id > $2";
    whereParams.push(id);
  } else if (before) {
    const id = fromGlobalId(before, "Event");
    whereClause = "WHERE id < $2";
    whereParams.push(id);
  }

  return { whereClause, whereParams };
};

export const getLimitFromArgs = (args: ConnectionArguments): number => {
  const { first, last } = args;
  const limit = first || last || defaultResultSize;

  if (limit > maxResultSize) {
    throw new Error(`Cannot query more than ${maxResultSize} nodes`);
  }

  return limit;
};

export const getOrderyByFromArgs = (args: ConnectionArguments): string => {
  const { last } = args;
  const direction = last ? "desc" : "asc";
  return `ORDER BY id ${direction}`;
};

export const queryFromTableWithConnectionArgs = async (
  pgClient: PoolClient,
  args: ConnectionArguments,
  table: string,
  additionalFields: string[]
): Promise<any> => {
  const { whereClause, whereParams } = getWhereFromArgs(args);
  const limit = getLimitFromArgs(args);
  const orderBy = getOrderyByFromArgs(args);
  const prev = `lag(id) over (${orderBy}) as prev`;
  const next = `lead(id) over (${orderBy}) as next`;
  const fields = ["id", prev, next, ...additionalFields.map(snakeCase)].join(
    ","
  );

  const sql = `
    SELECT ${fields}           
    FROM ${table}
    ${whereClause}
    ${orderBy}
    limit $1`;
  const params = [limit, ...whereParams];

  const { rows } = await pgClient.query(sql, params);
  return rows;
};

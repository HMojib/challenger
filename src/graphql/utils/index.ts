import {
  fromGlobalId as fromGlobalIdRelay,
  toGlobalId,
  Connection,
} from "graphql-relay";

import { Node, Interval } from "../types";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  ResolveTree,
} from "graphql-parse-resolve-info";
import { GraphQLObjectType, GraphQLResolveInfo } from "graphql";

export const fromGlobalId = (
  globalId: string,
  expectedType: string
): string => {
  const { type, id } = fromGlobalIdRelay(globalId);

  if (type.toLowerCase() !== expectedType.toLowerCase()) {
    throw new Error(
      `Given ID is of type ${type}. Expected type is ${expectedType}`
    );
  }

  return id;
};

export const connectionFromNodes = (
  nodes: Node[],
  type: string
): Connection<any> => {
  const edges = nodes.map((node) => ({
    cursor: toGlobalId(type, node.id),
    node,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  const pageInfo = {
    startCursor: firstEdge?.cursor,
    endCursor: lastEdge?.cursor,
    hasNextPage: (lastEdge?.node?.next && true) || false,
    hasPreviousPage: (firstEdge?.node?.prev && true) || false,
  };

  return { edges, pageInfo };
};

export const parseInterval = (interval: Interval): string => {
  //https://github.com/graphile/graphile-engine/blob/2739f7941c97ca383887686e97cf659b8c20f802/packages/graphile-build-pg/src/plugins/PgTypesPlugin.js
  const keys = ["seconds", "minutes", "hours", "days", "months", "years"];
  const parts = [];
  for (const key of keys) {
    if (interval[key]) {
      parts.push(`${interval[key]} ${key}`);
    }
  }
  return parts.join(" ");
};

export const resolveNodeFieldsFromConnection = (
  info: GraphQLResolveInfo,
  connection: GraphQLObjectType,
  nodeType: string
): string[] => {
  const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;
  const ConnectionInfo = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment,
    connection
  );
  const edgeType = `${nodeType}Edge`;
  const fields =
    // @ts-ignore: Unreachable code error
    ConnectionInfo.fields?.edges?.fieldsByTypeName?.[edgeType]?.node
      ?.fieldsByTypeName?.[nodeType] || {};

  return Object.keys(fields).filter((key) => key !== "id");
};

export const resolveNodeFieldsFromNode = (
  info: GraphQLResolveInfo,
  node: GraphQLObjectType
): string[] => {
  const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;
  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment,
    node
  );

  return Object.keys(fields).filter((key) => key !== "id");
};

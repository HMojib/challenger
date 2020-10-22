import { ConnectionArguments, connectionArgs } from "graphql-relay";
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import {
  fromGlobalId,
  connectionFromNodes,
  resolveNodeFieldsFromConnection,
} from "../utils";
import { pgPool, getChallengeTypes } from "../../db";
import {
  ChallengeTypeNodeName,
  ChallengeTypeType,
  ChallengeTypeConnection,
  NodeByIDArguments,
} from "../types";
import { Context } from "../context";

export const challengeTypes: GraphQLFieldConfig<
  {},
  Context,
  ConnectionArguments
> = {
  type: ChallengeTypeConnection,
  args: connectionArgs,
  description: "The list of challenge types.",

  async resolve(self, args, ctx, info) {
    const fields = resolveNodeFieldsFromConnection(
      info,
      ChallengeTypeConnection,
      ChallengeTypeNodeName
    );

    const pgClient = await pgPool.connect();

    try {
      const nodes = await getChallengeTypes(pgClient, args, fields);

      return connectionFromNodes(nodes, ChallengeTypeNodeName);
    } finally {
      pgClient.release();
    }
  },
};

export const challengeType: GraphQLFieldConfig<
  {},
  Context,
  ConnectionArguments
> = {
  type: ChallengeTypeType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: "Challenge type by ID",
  resolve: (self, args, ctx, info) => {
    const { id: globalId } = args as NodeByIDArguments;
    const challengeTypeId = fromGlobalId(globalId, ChallengeTypeNodeName);
    const { loaders } = ctx;
    const { challengeTypeLoader } = loaders;

    return challengeTypeLoader.load(Number(challengeTypeId));
  },
};

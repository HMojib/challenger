import { ConnectionArguments, connectionArgs } from "graphql-relay";
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import {
  fromGlobalId,
  connectionFromNodes,
  resolveNodeFieldsFromConnection,
} from "../utils";
import { pgPool, getChallengeTemplates } from "../../db";
import {
  ChallengeTemplateNodeName,
  ChallengeTemplateType,
  ChallengeTemplateConnection,
  NodeByIDArguments,
} from "../types";
import { Context } from "../context";
import { challengeTemplateById } from "../resolvers";
export const challengeTemplates: GraphQLFieldConfig<
  {},
  Context,
  ConnectionArguments
> = {
  type: ChallengeTemplateConnection,
  args: connectionArgs,
  description: "The list of event types.",

  async resolve(self, args, ctx, info) {
    const pgClient = await pgPool.connect();
    const fields = resolveNodeFieldsFromConnection(
      info,
      ChallengeTemplateConnection,
      ChallengeTemplateNodeName
    );

    try {
      const nodes = await getChallengeTemplates(pgClient, args, fields);

      return connectionFromNodes(nodes, ChallengeTemplateNodeName);
    } finally {
      pgClient.release();
    }
  },
};

export const challengeTemplate: GraphQLFieldConfig<
  {},
  Context,
  ConnectionArguments
> = {
  type: ChallengeTemplateType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: "Challenge template by ID",
  resolve: (self, args, ctx, info) => {
    const { id: globalId } = args as NodeByIDArguments;
    const challengeTemplateId = fromGlobalId(
      globalId,
      ChallengeTemplateNodeName
    );
    return challengeTemplateById(challengeTemplateId, info);
  },
};

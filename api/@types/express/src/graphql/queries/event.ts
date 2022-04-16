import { ConnectionArguments, connectionArgs } from "graphql-relay";
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import { fromGlobalId, connectionFromNodes } from "../../utils";
import { pgPool, getEvents } from "../../db";
import { EventType, EventConnection, NodeByIDArguments } from "../types";
import { Context } from "../context";
import { eventById } from "../resolvers";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  ResolveTree,
} from "graphql-parse-resolve-info";

export const events: GraphQLFieldConfig<{}, Context, ConnectionArguments> = {
  type: EventConnection,
  args: connectionArgs,
  description: "The list of events.",

  async resolve(self, args, ctx, info) {
    const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;
    const EventConnectionInfo = simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment,
      EventConnection
    );

    const additionalFields =
      // @ts-ignore: Unreachable code error
      EventConnectionInfo.fields?.edges?.fieldsByTypeName?.EventEdge?.node
        ?.fieldsByTypeName?.Event || {};

    const pgClient = await pgPool.connect();

    try {
      const nodes = await getEvents(
        pgClient,
        args,
        Object.keys(additionalFields).filter((key) => key !== "id")
      );

      return connectionFromNodes(nodes, "Event");
    } finally {
      pgClient.release();
    }
  },
};

export const event: GraphQLFieldConfig<{}, Context, ConnectionArguments> = {
  type: EventType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: "Event by ID",
  resolve: (self, args, ctx, info) => {
    const { id: globalId } = args as NodeByIDArguments;
    const eventId = fromGlobalId(globalId, "Event");
    return eventById(eventId, info);
  },
};

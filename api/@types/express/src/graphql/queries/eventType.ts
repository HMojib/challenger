import { ConnectionArguments, connectionArgs } from "graphql-relay";
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import { fromGlobalId, connectionFromNodes } from "../../utils";
import { pgPool, getEventTypes } from "../../db";
import {
  EventTypeType,
  EventTypeConnection,
  NodeByIDArguments,
} from "../types";
import { Context } from "../context";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  ResolveTree,
} from "graphql-parse-resolve-info";

export const eventTypes: GraphQLFieldConfig<{}, Context, ConnectionArguments> =
  {
    type: EventTypeConnection,
    args: connectionArgs,
    description: "The list of event types.",

    async resolve(self, args, ctx, info) {
      const parsedResolveInfoFragment = parseResolveInfo(info) as ResolveTree;
      const ConnectionInfo = simplifyParsedResolveInfoFragmentWithType(
        parsedResolveInfoFragment,
        EventTypeConnection
      );

      const additionalFields =
        // @ts-ignore: Unreachable code error
        ConnectionInfo.fields?.edges?.fieldsByTypeName?.EventTypeEdge?.node
          ?.fieldsByTypeName?.EventType || {};

      const pgClient = await pgPool.connect();

      try {
        const nodes = await getEventTypes(
          pgClient,
          args,
          Object.keys(additionalFields).filter((key) => key !== "id")
        );

        return connectionFromNodes(nodes, "EventType");
      } finally {
        pgClient.release();
      }
    },
  };

export const eventType: GraphQLFieldConfig<{}, Context, ConnectionArguments> = {
  type: EventTypeType,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  description: "Event type by ID",
  resolve: (self, args, ctx, info) => {
    const { id: globalId } = args as NodeByIDArguments;
    const eventTypeId = fromGlobalId(globalId, "EventType");
    const { loaders } = ctx;
    const { eventTypeLoader } = loaders;

    return eventTypeLoader.load(Number(eventTypeId));
  },
};

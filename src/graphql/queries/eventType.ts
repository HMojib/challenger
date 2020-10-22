import { ConnectionArguments, connectionArgs } from "graphql-relay";
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import {
  fromGlobalId,
  connectionFromNodes,
  resolveNodeFieldsFromConnection,
} from "../utils";
import { pgPool, getEventTypes } from "../../db";
import {
  EventTypeType,
  EventTypeConnection,
  NodeByIDArguments,
} from "../types";
import { Context } from "../context";

export const eventTypes: GraphQLFieldConfig<
  {},
  Context,
  ConnectionArguments
> = {
  type: EventTypeConnection,
  args: connectionArgs,
  description: "The list of event types.",

  async resolve(self, args, ctx, info) {
    const fields = resolveNodeFieldsFromConnection(
      info,
      EventTypeConnection,
      "EventType"
    );

    const pgClient = await pgPool.connect();

    try {
      const nodes = await getEventTypes(pgClient, args, fields);

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

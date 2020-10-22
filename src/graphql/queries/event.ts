import { ConnectionArguments, connectionArgs } from "graphql-relay";
import { GraphQLFieldConfig, GraphQLID, GraphQLNonNull } from "graphql";

import {
  fromGlobalId,
  connectionFromNodes,
  resolveNodeFieldsFromConnection,
} from "../utils";
import { pgPool, getEvents } from "../../db";
import { EventType, EventConnection, NodeByIDArguments } from "../types";
import { Context } from "../context";
import { eventById } from "../resolvers";

export const events: GraphQLFieldConfig<{}, Context, ConnectionArguments> = {
  type: EventConnection,
  args: connectionArgs,
  description: "The list of events.",

  async resolve(self, args, ctx, info) {
    const fields = resolveNodeFieldsFromConnection(
      info,
      EventConnection,
      "Event"
    );

    const pgClient = await pgPool.connect();

    try {
      const nodes = await getEvents(pgClient, args, fields);

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

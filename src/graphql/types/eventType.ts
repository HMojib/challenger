import { globalIdField, connectionDefinitions } from "graphql-relay";
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const EventTypeType = new GraphQLObjectType({
  description: "Available event types",
  name: "EventType",
  fields: {
    id: globalIdField("EventType", (eventType) => eventType.id),
    tag: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const EventTypeConnection = connectionDefinitions({
  name: "EventType",
  nodeType: EventTypeType,
}).connectionType;

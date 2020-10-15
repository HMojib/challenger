import { globalIdField, connectionDefinitions } from "graphql-relay";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
} from "graphql";

import { GraphQLDateTime } from "graphql-iso-date";

import { IntervalInputType, IntervalType, Interval } from "./common";

export const EventInputType = new GraphQLInputObjectType({
  name: "EventInput",
  description: "Fields for a new event",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    startTime: { type: new GraphQLNonNull(GraphQLDateTime) },
    frequency: { type: new GraphQLNonNull(IntervalInputType) },
  },
});

export const EventPatchType = new GraphQLInputObjectType({
  name: "EventPatch",
  fields: {
    title: { type: GraphQLString },
    startTime: { type: GraphQLDateTime },
    frequency: { type: IntervalInputType },
    description: { type: GraphQLString },
  },
});

export const EventType = new GraphQLObjectType({
  description: "An event with many challenges",
  name: "Event",
  fields: {
    id: globalIdField("Event", (event) => event.id),
    title: { type: new GraphQLNonNull(GraphQLString) },
    frequency: { type: new GraphQLNonNull(IntervalType) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    startTime: { type: new GraphQLNonNull(GraphQLDateTime) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    createdBy: globalIdField("User", (event) => event.createdBy),
  },
});

export const EventConnection = connectionDefinitions({
  name: "Event",
  nodeType: EventType,
}).connectionType;

export interface EventInput {
  title: string;
  description: string;
  frequency: Interval;
  startTime: string;
}

export interface EventPatch {
  [key: string]: string | Interval | undefined;
  title?: string;
  description?: string;
  frequency?: Interval;
  startTime?: string;
}

export interface DeleteEventInput {
  id: string;
}

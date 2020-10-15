import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt,
} from "graphql";

export interface NodeByIDArguments {
  id: string;
}

export interface Node {
  id: string;
  prev: string | null;
  next: string | null;
}

export const IntervalType = new GraphQLObjectType({
  name: "Interval",
  description:
    "An interval of time that has passed where the smallest distinct unit is a second.",
  fields: {
    seconds: { type: GraphQLFloat, description: "A quantity of seconds." },
    minutes: { type: GraphQLInt, description: "A quantity of minutes." },
    hours: { type: GraphQLInt, description: "A quantity of hours." },
    days: { type: GraphQLInt, description: "A quantity of days." },
    months: { type: GraphQLInt, description: "A quantity of months." },
    years: { type: GraphQLInt, description: "A quantity of years." },
  },
});

export const IntervalInputType = new GraphQLInputObjectType({
  name: "IntervalInput",
  description:
    "An interval of time that has passed where the smallest distinct unit is a second.",
  fields: {
    seconds: { type: GraphQLFloat, description: "A quantity of seconds." },
    minutes: { type: GraphQLInt, description: "A quantity of minutes." },
    hours: { type: GraphQLInt, description: "A quantity of hours." },
    days: { type: GraphQLInt, description: "A quantity of days." },
    months: { type: GraphQLInt, description: "A quantity of months." },
    years: { type: GraphQLInt, description: "A quantity of years." },
  },
});

export interface Interval {
  [key: string]: number | undefined;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  months?: number;
  years?: number;
}

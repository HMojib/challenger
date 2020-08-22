import { User } from "../db";

import { globalIdField } from "graphql-relay";
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLID,
} from "graphql";

import { Assignment } from "../db";
import { Context } from "../context";

export const AssignmentType = new GraphQLObjectType<Assignment, Context>({
  name: "Assignment",
  fields: {
    id: globalIdField(),
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    startOnWeek: { type: new GraphQLNonNull(GraphQLInt) },
    repeatInterval: { type: new GraphQLNonNull(BigInt) },
    repeatFor: { type: new GraphQLNonNull(GraphQLInt) },
    sunday: { type: new GraphQLNonNull(GraphQLBoolean) },
    monday: { type: new GraphQLNonNull(GraphQLBoolean) },
    tuesday: { type: new GraphQLNonNull(GraphQLBoolean) },
    wednesday: { type: new GraphQLNonNull(GraphQLBoolean) },
    thursday: { type: new GraphQLNonNull(GraphQLBoolean) },
    friday: { type: new GraphQLNonNull(GraphQLBoolean) },
    saturday: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

// export const AssignmentInputType = new GraphQLInputObjectType({
//   name: "AssignmentInput",

//   fields: {
//     programId: { type: new GraphQLNonNull(GraphQLID) },
//     title: { type: new GraphQLNonNull(GraphQLString) },
//     content: { type: new GraphQLNonNull(GraphQLString) },
//     length: { type: new GraphQLNonNull(GraphQLInt) },
//     startOnWeek: { type: new GraphQLNonNull(GraphQLInt) },
//     repeatInterval: { type: BigInt },
//     repeatFor: { type: GraphQLInt },
//     sunday: { type: GraphQLBoolean },
//     monday: { type: GraphQLBoolean },
//     tuesday: { type: GraphQLBoolean },
//     wednesday: { type: GraphQLBoolean },
//     thursday: { type: GraphQLBoolean },
//     friday: { type: GraphQLBoolean },
//     saturday: { type: GraphQLBoolean },
//   },
// });

// export const AssignmentPatchType = new GraphQLInputObjectType({
//   name: "AssignmentPatch",

//   fields: {
//     programId: { type: GraphQLID },
//     title: { type: GraphQLString },
//     content: { type: GraphQLString },
//     length: { type: GraphQLInt },
//     startOnWeek: { type: GraphQLInt },
//     repeatInterval: { type: BigInt },
//     repeatFor: { type: GraphQLInt },
//     sunday: { type: GraphQLBoolean },
//     monday: { type: GraphQLBoolean },
//     tuesday: { type: GraphQLBoolean },
//     wednesday: { type: GraphQLBoolean },
//     thursday: { type: GraphQLBoolean },
//     friday: { type: GraphQLBoolean },
//     saturday: { type: GraphQLBoolean },
//   },
// });

// export const abcType = new GraphQLObjectType<Assignment, Context>({
//   name: "abc",
//   fields: {
//     id: globalIdField(),
//     title: { type: new GraphQLNonNull(GraphQLString) },
//     content: { type: new GraphQLNonNull(GraphQLString) },
//     createdAt: { type: new GraphQLNonNull(GraphQLString) },
//     updatedAt: { type: new GraphQLNonNull(GraphQLString) },
//   },
// });

// export const WeeklyAssignmentType = new GraphQLObjectType<Assignment, Context>({
//   name: "WeeklyAssignmentView",
//   fields: {
//     week: { type: new GraphQLNonNull(GraphQLInt) },
//     assignments: { type: AssignmentType },
//   },
// });

export const Hello = "hello";

declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

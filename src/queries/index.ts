// import {
//   connectionFromArraySlice,
//   cursorToOffset,
//   ConnectionArguments,
//   connectionDefinitions,
// } from "graphql-relay";
// import { GraphQLFieldConfig } from "graphql";

// import * as db from "../db";
// import { AssignmentType } from "../types";
// import { Context } from "../context";

// export const assignments: GraphQLFieldConfig<
//   null,
//   ConnectionArguments,
//   Context
// > = {
//   type: connectionDefinitions({
//     name: "Assignment",
//     nodeType: AssignmentType,
//   }).connectionType,

//   description: "The list of assignments.",

//   async resolve(self, args, ctx) {
//     const limit = (args.first as number) || 100;
//     const offset = args.after ? cursorToOffset(args.after) + 1 : 0;
//     const data = await db
//       .table("assignments")
//       .limit(limit)
//       .offset(offset)
//       .select();

//     return connectionFromArraySlice(data, args, {
//       sliceStart: offset,
//       arrayLength: offset + data.length,
//     });
//   },
// };

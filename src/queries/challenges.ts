import {
  connectionDefinitions,
  connectionFromArraySlice,
  ConnectionArguments,
  cursorToOffset,
} from "graphql-relay";
import { GraphQLFieldConfig } from "graphql";

import db from "../db";
import { ProgramType } from "../types";
import { Context } from "../context";

export const programs: GraphQLFieldConfig<{}, Context, ConnectionArguments> = {
  type: connectionDefinitions({
    name: "Program",
    nodeType: ProgramType,
  }).connectionType,

  description: "The list of training programs.",

  async resolve(self, args, ctx) {
    const limit = (args.first as number) || 100;
    const offset = args.after ? cursorToOffset(args.after) + 1 : 0;

    const data = await db
      .table("programs")
      .limit(limit)
      .offset(offset)
      .select();

    return connectionFromArraySlice(data, args, {
      sliceStart: offset,
      arrayLength: offset + data.length,
    });
  },
};

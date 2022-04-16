import { GraphQLSchema, GraphQLObjectType } from "graphql";

import * as queries from "./queries";
import * as mutations from "./mutations";

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Root",
    description: "The top-level API",
    fields: queries,
  }),

  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: mutations,
  }),
});

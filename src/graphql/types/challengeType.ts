import { globalIdField, connectionDefinitions } from "graphql-relay";
import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const ChallengeTypeNodeName = "ChallengeType";

export const ChallengeTypeType = new GraphQLObjectType({
  description: "Available challenge types",
  name: ChallengeTypeNodeName,
  fields: {
    id: globalIdField(
      ChallengeTypeNodeName,
      (challengeType) => challengeType.id
    ),
    tag: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const ChallengeTypeConnection = connectionDefinitions({
  name: ChallengeTypeNodeName,
  nodeType: ChallengeTypeType,
}).connectionType;

import { globalIdField, connectionDefinitions } from "graphql-relay";
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInt,
} from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

import { challengeTypeById } from "../resolvers";

export const ChallengeTemplateNodeName = "ChallengeTemplate";

export const ChallengeTemplateType = new GraphQLObjectType({
  description: "Challenge template to add to an event",
  name: ChallengeTemplateNodeName,
  fields: {
    id: globalIdField(
      ChallengeTemplateNodeName,
      (challengeTemplate) => challengeTemplate.id
    ),
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: new GraphQLNonNull(GraphQLDateTime) },
    createdBy: globalIdField(
      "User",
      (challengeTemplate) => challengeTemplate.createdBy
    ),
    challengeType: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: challengeTypeById,
    },
  },
});

export const ChallengeTemplateConnection = connectionDefinitions({
  name: ChallengeTemplateNodeName,
  nodeType: ChallengeTemplateType,
}).connectionType;

export const ChallengeTemplateInputType = new GraphQLInputObjectType({
  name: "ChallengeTemplateInput",
  description: "Fields for new challenge template",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    challengeType: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const ChallengeTemplatePatchType = new GraphQLInputObjectType({
  name: "ChallengeTemplatePatch",
  fields: {
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    challengeType: { type: GraphQLString },
  },
});

export interface ChallengeTemplateInput {
  title: string;
  description: string;
  challengeType: number;
}

export interface ChallengeTemplatePatch {
  [key: string]: string | number | undefined;
  title: string;
  description: string;
  challengeType: number;
}

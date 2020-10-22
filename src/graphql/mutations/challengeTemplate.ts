import { GraphQLNonNull, GraphQLResolveInfo, GraphQLID } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { Context } from "../context";
import {
  ChallengeTemplateInputType,
  ChallengeTemplateInput,
  ChallengeTemplateType,
  ChallengeTemplatePatchType,
  ChallengeTemplatePatch,
  ChallengeTemplateNodeName,
} from "../types";
import {
  pgPool,
  insertChallengeTemplate,
  User,
  UpdateChallengeTemplate,
  ChallengeTemplate,
  getChallengeTemplateById,
  updateChallengeTemplateById,
} from "../../db";
import { challengeTemplateById } from "../resolvers";
import { fromGlobalId } from "../utils";

export interface CreateChallengeTemplatetInput {
  challengeTemplate: ChallengeTemplateInput;
}

export interface UpdatChallengeTemplateInput {
  id: string;
  patch: ChallengeTemplatePatch;
}

const validateChallengeTemplatePatch = (
  challengeTemplate: ChallengeTemplate,
  userId: string,
  patch: ChallengeTemplatePatch | undefined = undefined
): boolean => {
  if (!challengeTemplate) {
    throw new Error("Challenge template not found");
  } else if (challengeTemplate.createdBy !== userId) {
    throw new Error(
      "You don't have permission to modify this challenge template"
    );
  } else if (patch && Object.keys(patch).length === 0) {
    throw new Error("Patch requires at least one argument");
  } else {
    return true;
  }
};

export const createChallengeTemplate = mutationWithClientMutationId({
  name: "CreateChallengeTemplate",
  description: "Create a new challenge template",

  inputFields: {
    challengeTemplate: { type: new GraphQLNonNull(ChallengeTemplateInputType) },
  },

  outputFields: {
    challengeTemplate: {
      type: ChallengeTemplateType,
      resolve: (
        { id }: ChallengeTemplate,
        args,
        ctx: Context,
        info: GraphQLResolveInfo
      ) => challengeTemplateById(id, info),
    },
  },

  mutateAndGetPayload: async (
    input: CreateChallengeTemplatetInput,
    ctx: Context
  ) => {
    const user = ctx.user as User;
    const { id: userId } = user;
    const { challengeTemplate } = input;
    const pgClient = await pgPool.connect();

    try {
      return await insertChallengeTemplate(pgClient, {
        ...challengeTemplate,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      });
    } finally {
      pgClient.release();
    }
  },
});

export const updateChallengeTemplate = mutationWithClientMutationId({
  name: "UpdateChallengeTemplate",
  description: "Update an existing challenge template",

  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    patch: { type: new GraphQLNonNull(ChallengeTemplatePatchType) },
  },

  outputFields: {
    challengeTemplate: {
      type: ChallengeTemplateType,
      resolve: (
        { id }: ChallengeTemplate,
        args,
        ctx: Context,
        info: GraphQLResolveInfo
      ) => challengeTemplateById(id, info),
    },
  },

  mutateAndGetPayload: async (
    { id, patch }: UpdatChallengeTemplateInput,
    ctx: Context
  ) => {
    const user = ctx.user as User;
    const { id: userId } = user;
    const challengeTemplateId = fromGlobalId(id, ChallengeTemplateNodeName);

    const pgClient = await pgPool.connect();

    try {
      const currentChallengeTemplate = await getChallengeTemplateById(
        pgClient,
        challengeTemplateId,
        ["createdBy"]
      );

      validateChallengeTemplatePatch(currentChallengeTemplate, userId, patch);

      return updateChallengeTemplateById(pgClient, challengeTemplateId, patch);
    } finally {
      pgClient.release();
    }
  },
});

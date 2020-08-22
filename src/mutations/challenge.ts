// import { GraphQLNonNull, GraphQLID } from "graphql";
// import {
//   mutationWithClientMutationId,
//   fromGlobalId,
//   ResolvedGlobalId,
// } from "graphql-relay";
// import { ProgramInputType, ProgramPatchType, ProgramType } from "../types";
// import { withAuthPgClient } from "../db";
// import { programById } from "../dataloaders";
// import { randomString } from "../utils";

// export const createProgram = mutationWithClientMutationId({
//   name: "CreateProgram",
//   description: "Create a new program",

//   inputFields: {
//     program: { type: new GraphQLNonNull(ProgramInputType) },
//   },

//   outputFields: {
//     program: {
//       type: ProgramType,
//       resolve: ({ programId }) => programById.load(programId),
//     },
//   },

//   mutateAndGetPayload: async ({ program }, ctx) => {
//     const id: string = randomString();
//     const authorId: string = ctx.user.id;
//     await db("programs").insert({
//       ...program,
//       id,
//       authorId,
//     });
//     return { programId: id };
//   },
// });

// export const updateProgram = mutationWithClientMutationId({
//   name: "UpdateProgram",
//   description: "Update an existing program",

//   inputFields: {
//     id: { type: new GraphQLNonNull(GraphQLID) },
//     patch: { type: new GraphQLNonNull(ProgramPatchType) },
//   },

//   outputFields: {
//     program: {
//       type: ProgramType,
//       resolve: ({ programId }) => programById.clear(programId).load(programId),
//     },
//   },

//   mutateAndGetPayload: async ({ id, patch }, ctx) => {
//     const { id: programId } = fromGlobalId(id) as ResolvedGlobalId;
//     await db("programs")
//       .where({ id: programId, authorId: ctx.user.id })
//       .update({ ...patch, updatedAt: new Date() });
//     return { programId };
//   },
// });

import { ChallengeTemplate } from "../../db";
import { Context } from "../context";

export const challengeTypeById = async (
  challengeTemplate: ChallengeTemplate,
  args: {},
  ctx: Context
) => {
  const { challengeType: challengeTypeId } = challengeTemplate;

  const { loaders } = ctx;
  const { challengeTypeLoader } = loaders;

  const { title } = await challengeTypeLoader.load(challengeTypeId);

  return title;
};

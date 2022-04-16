const faker = require("faker");
const {
  seed: { count: seedCount },
} = require("../config");

const getUserId = () => (faker.datatype.number() % seedCount) + 1;

const createChallengeTemplate = () => ({
  title: faker.lorem.word(faker.datatype.number(30)),
  description: faker.lorem.words(faker.datatype.number(5)),
  created_by: getUserId(),
});

exports.seed = async (knex) => {
  let challengeTemplates = [];

  for (let i = 1; i <= seedCount; i++) {
    challengeTemplates.push({ id: i, ...createChallengeTemplate() });
  }

  await knex("challenge_template").del();
  await knex("challenge_template").insert(challengeTemplates);
};

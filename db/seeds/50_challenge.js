const faker = require("faker");
const {
  seed: { count: seedCount },
} = require("../config");

const getForeignId = () => (faker.datatype.number() % seedCount) + 1;

const createChallenge = () => ({
  start_at: faker.datatype.datetime(),
  title: faker.lorem.word(faker.datatype.number(30)),
  description: faker.lorem.words(faker.datatype.number(5)),
  created_by: getForeignId(),
  challenge_template_id: getForeignId(),
  event_id: getForeignId(),
});

exports.seed = async (knex) => {
  let challenges = [];

  for (let i = 1; i <= seedCount; i++) {
    challenges.push({ id: i, ...createChallenge() });
  }

  await knex("challenge").del();
  await knex("challenge").insert(challenges);
};

const faker = require("faker");

const {
  db: {
    seed: { count: seedCount },
  },
} = require("../config");

const getUserId = () => (faker.datatype.number() % seedCount) + 1;

const createEvent = () => ({
  title: faker.lorem.word(faker.datatype.number(30)),
  description: faker.lorem.words(faker.datatype.number(5)),
  start_at: faker.datatype.datetime(),
  created_by: getUserId(),
  event_type: 1,
});

exports.seed = async (knex) => {
  let events = [];

  for (let i = 1; i <= seedCount; i++) {
    events.push({ id: i, ...createEvent() });
  }

  await knex("event_type").del();
  await knex("event_type").insert(events);
};

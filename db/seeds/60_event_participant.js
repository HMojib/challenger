const faker = require("faker");
const {
  seed: { count: seedCount },
} = require("../config");

const getForeignId = () => (faker.datatype.number() % seedCount) + 1;

const createEventParticipant = () => ({
  participant_id: getForeignId(),
  event_id: getForeignId(),
  accepted_invite: faker.datatype.number() % 2 === 0,
});

exports.seed = async (knex) => {
  let eventParticpants = [];

  for (let i = 1; i <= seedCount; i++) {
    eventParticpants.push({ id: i, ...createEventParticipant() });
  }

  await knex("event_participant").del();
  await knex("event_participant").insert(eventParticpants);
};

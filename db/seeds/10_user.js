const faker = require("faker");
const {
  db: {
    seed: { count: seedCount },
  },
} = require("../config");

const getRandomMiddleInitial = () => {
  const number = faker.datatype.number() % 25;

  if (number % 3 === 0) {
    return null;
  } else {
    String.fromCharCode(97 + number);
  }
};

const createFakeUser = () => ({
  first_name: faker.name.firstName(),
  middle_initial: getRandomMiddleInitial(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  google_id: faker.datatype.uuid(),
});

exports.seed = async (knex) => {
  let fakeUsers = [];

  for (let i = 1; i <= seedCount; i++) {
    fakeUsers.push({ id: i, ...createFakeUser() });
  }

  await knex("user").del();
  await knex("user").insert(fakeUsers);
};

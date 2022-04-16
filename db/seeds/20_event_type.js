exports.seed = async (knex) => {
  const eventTypes = [
    {
      id: 1,
      tag: "music",
      title: "Music",
    },
  ];

  await knex("event_type").del();
  await knex("event_type").insert(eventTypes);
};

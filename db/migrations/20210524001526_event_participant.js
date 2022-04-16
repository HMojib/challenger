exports.up = (knex) =>
  knex.schema.createTable("event_participant", (table) => {
    table
      .foreign("participant_id")
      .references("user.id")
      .notNullable()
      .onUpdate("cascade")
      .onDelete("cascade");
    table
      .foreign("event_id")
      .references("event.id")
      .notNullable()
      .onUpdate("cascade")
      .onDelete("cascade");
    table.boolean("accepted_invite").notNullable().defaultTo(false).index();
    table.primary(["participant_id", "event_id"]);
  });

exports.down = (knex) => knex.schema.dropTable("vote");

exports.up = (knex) =>
  knex.schema.createTable("event_type", (table) => {
    table.increments();
    table.string("tag", 15).notNullable().unique();
    table.string("title", 25).notNullable().unique();
  });

exports.down = (knex) => knex.schema.dropTable("event_type");

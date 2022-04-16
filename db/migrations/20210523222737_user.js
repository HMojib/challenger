exports.up = (knex) =>
  knex.schema.createTable("user", (table) => {
    table.increments();
    table.string("first_name", 255).notNullable();
    table.string("middle_initial", 1);
    table.string("last_name", 255).notNullable();
    table.string("email", 256).notNullable().unique();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.string("google_id").unique();
  });

exports.down = (knex) => knex.schema.dropTable("user");

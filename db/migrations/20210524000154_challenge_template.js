exports.up = (knex) =>
  knex.schema.createTable("challenge_template", (table) => {
    table.increments();
    table.string("title", 30).notNullable().unique();
    table.string("description", 150);
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .foreign("created_by")
      .references("user.id")
      .notNullable()
      .onUpdate("cascade")
      .onDelete("cascade")
      .index();
  });

exports.down = (knex) => knex.schema.dropTable("challenge_template");

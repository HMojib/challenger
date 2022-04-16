exports.up = (knex) =>
  knex.schema.createTable("event", (table) => {
    table.increments();
    table.string("title", 30).notNullable().unique();
    table.string("description", 150);
    table.timestamp("start_at").notNullable().defaultTo(knex.fn.now());
    table.specificType("frequency", "interval").notNullable().defaultTo("1 d");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table
      .foreign("created_by")
      .references("user.id")
      .notNullable()
      .onUpdate("cascade")
      .onDelete("cascade")
      .index();
    table
      .foreign("event_type")
      .references("event_type.id")
      .notNullable()
      .onUpdate("cascade")
      .onDelete("cascade")
      .index();
  });

exports.down = (knex) => knex.schema.dropTable("event");

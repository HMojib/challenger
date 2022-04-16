exports.up = (knex) =>
  knex.schema
    .createTable("challenge", (table) => {
      table.increments();
      table.timestamp("start_at").notNullable();
      table.timestamp("end_at").notNullable();
      table
        .foreign("challenge_template_id")
        .references("challenge_template.id")
        .notNullable()
        .onUpdate("cascade")
        .onDelete("cascade")
        .index();
      table
        .foreign("event_id")
        .references("event.id")
        .notNullable()
        .onUpdate("cascade")
        .onDelete("cascade")
        .index();
    })
    .then(() =>
      knex.schema.raw(`
        ALTER TABLE challenge
        ADD CONSTRAINT start_end_at
        CHECK (end_at > start_at)
      `)
    );

exports.down = (knex) => knex.schema.dropTable("challenge");

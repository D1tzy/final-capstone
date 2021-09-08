
exports.up = function(knex) {
    console.log("creating tables")
  return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary()
      table.string("table_name")
      table.integer("capacity")
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("tables");
};

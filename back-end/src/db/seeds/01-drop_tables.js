
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE");

};

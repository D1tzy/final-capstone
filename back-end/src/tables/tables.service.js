const knex = require("../db/connection")

function read(tableId) {
    return knex("tables")
        .select("*")
        .where("capacity", "=", tableId)
}

module.exports = {
    read,
}
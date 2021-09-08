const knex = require("../db/connection")

function read(date) {
    return knex("reservations")
        .select("*")
        .where({"reservation_date": date})
        .orderBy("reservation_time")
}

function insert(data) {
    return knex("reservations")
        .insert(data)
        .returning("*")
        .then(newData => newData[0])
}

module.exports = {
    read,
    insert,
}
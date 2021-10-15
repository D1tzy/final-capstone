const knex = require("../db/connection")

function listByDate(date) {
    return knex("reservations")
        .where({"reservation_date": date})
        .whereNot({"status": "finished"})
        .orderBy("reservation_time")
}

function listByNumber(number) {
    return knex("reservations")
        /*.whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )*/
        .where("mobile_number", "like", `%${number}%`)
        .orderBy("reservation_date")
}

function read(id) {
    return knex("reservations")
        .where({"reservation_id": id})
}

function insert(data) {
    return knex("reservations")
        .insert(data)
        .returning("*")
        .then(newData => newData[0])

}

function update(id, status) {
    return knex("reservations")
        .where({"reservation_id": id})
        .update({"status": status})
        .returning("*")
        .then(updatedData => updatedData[0])
}

function updateReservation(data) {
    return knex("reservations")
        .where({"reservation_id": data.reservation_id})
        .update(data)
        .returning("*")
        .then(updatedData => updatedData[0])
}

function destroy(id) {
    return knex('reservations')
        .where({'reservation_id': id})
        .del()
}

module.exports = {
    listByDate,
    listByNumber,
    read,
    insert,
    update,
    updateReservation,
    destroy
}
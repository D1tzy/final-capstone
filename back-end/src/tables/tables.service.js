const knex = require("../db/connection")

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}

function read(tableId) {
    return knex("tables")
        .select("*")
        .where({"table_id": tableId})
        .first()
}

function insert(data) {
    return knex("tables")
        .insert(data)
        .returning("*")
        .then(newData => newData[0])
}

function update(updatedTable) {
    return knex("tables")
        .select("*")
        .where({"table_id": updatedTable.table_id})
        .update(updatedTable)
        .returning("*")
        .then(updatedData => updatedData[0])
}

function setStatus(id, status) {
    return knex("reservations")
        .where({"reservation_id": id})
        .update({"status": status})
}

function destroy(id) {
    return knex("tables")
        .where({"reservation_id": id})
        .update({"reservation_id": knex.raw("NULL")})
}

function deleteTable(id) {
    return knex("tables")
        .where({"table_id": id})
        .del()
}

module.exports = {
    list,
    read,
    insert,
    update,
    setStatus,
    destroy,
    deleteTable
}
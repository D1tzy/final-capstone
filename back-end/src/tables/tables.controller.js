const service = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")
const asyncErrorBoundary = require('../utils/asyncErrorBoundary')

async function list(req, res, next) {
    res.json({data: await service.list()})
}

function read(req, res, next) {
    res.json({data: res.locals.readData})
}

async function create(req, res, next) {
    res.status(201).json({data: await service.insert(res.locals.data)})
}

async function update(req, res, next) {
    const updatedTable = {
        table_id: res.locals.tableId,
        table_name: res.locals.readData.table_name,
        capacity: res.locals.readData.capacity,
        reservation_id: res.locals.readData.reservation_id || res.locals.reservation_id,
    }
    
    await service.setStatus(res.locals.tableId, "seated")

    res.json({data: await service.update(updatedTable)})
}

async function destroy(req, res, next) {
    await service.setStatus(res.locals.readData.reservation_id, "finished")
    const data = await {...res.locals.readData, reservation_id: null}
    res.json({data: await service.update(data)})
}

async function deleteTable(req, res, next) {
    res.json({data:await service.deleteTable(res.locals.tableId)})
}

async function tableExists(req, res, next) {
    const {tableId} = req.params

    const data = await service.read(tableId)

    if (!data || data.length === 0) return next({status: 404, message: `Table not found: ${tableId}`})

    res.locals.readData = data
    res.locals.tableId = tableId
    console.log(data, tableId)
    return next()
}

function hasData(req, res, next) {
    const {data} = req.body
  
    if (!data) return next({status: 400, message: "Values should be in the 'data' section of the request body"})
    
    res.locals.data = data

    return next()
  }

function hasValidProperties(req, res, next) {
    const {table_name, capacity} = res.locals.data

    if (!table_name || table_name.length === 0 || table_name.length === 1) return next({status: 400, message: "The table_name property must be included and must be longer than one character"})
    if (!capacity || capacity === 0 || isNaN(capacity)) return next({status: 400, message: "The capacity property must be included, must be a number, and can not be 0"})

    return next()
}

function putRequestValidProperties(req, res, next) {
    const {reservation_id} = res.locals.data

    if (!reservation_id || reservation_id.length <= 0) return next({status: 400, message: "The reservation_id property is required and can not be less than or equal to 0"})

    res.locals.reservation_id = reservation_id

    return next()
}

async function reservationExists(req, res, next) {
    const data = await reservationsService.read(res.locals.data.reservation_id)

    if (!data || data.length === 0) return next({status: 404, message: `Reservation ${res.locals.data.reservation_id} not found`})

    res.locals.data = data[0]

    return next()
}

function hasCapacity(req, res, next) {
    if (res.locals.readData.capacity - res.locals.data.people < 0) return next({status: 400, message: "Insufficient capacity"})
    if (res.locals.readData.reservation_id !== null) return next({status: 400, message: "Table is already occupied"})
    
    return next()
}

function isNotSeated(req, res, next) {
    if (res.locals.data.status === "seated") return next({status: 400, message: "Reservation is already seated"})

    return next()
}

function properlyOccupied(req, res, next) {
    if (req.originalUrl === `/tables/${res.locals.tableId}/seat` && res.locals.readData.reservation_id === null) return next({status: 400, message: "Table is not occupied"})
    if (req.originalUrl === `tables/${res.locals.tableId}` && res.locals.readData.reservation_id !== null) return next({status: 400, message: "Table is occupied"})

    return next()
}


module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(tableExists), read],
    create: [hasData, hasValidProperties, asyncErrorBoundary(create)],
    update: [hasData, putRequestValidProperties, asyncErrorBoundary(reservationExists), asyncErrorBoundary(tableExists), hasCapacity, isNotSeated, asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(tableExists), properlyOccupied, asyncErrorBoundary(destroy)],
    deleteTable: [asyncErrorBoundary(tableExists), properlyOccupied, asyncErrorBoundary(deleteTable)]
}
// reservations controller file


const service = require("./reservations.service")
const validTime = require("../utils/validTime");

const asyncErrorBoundary = require('../utils/asyncErrorBoundary')

function list(req, res, next) {
  res.json({data: res.locals.data});
}

function read(req, res, next) {
  res.json({data: res.locals.data})
}

async function create(req, res) {
  res.status(201).json({data: await service.insert(res.locals)})
}

async function update(req, res, next) {
  res.json({data: await service.update(res.locals.data.reservation_id, res.locals.status || "cancelled")})
}

async function updateReservation(req, res, next) {
  res.json({data: await service.updateReservation(res.locals)})
}

async function destroy(req, res, next) {
  res.json({data: await service.destroy(res.locals.reservation_id)})
}

async function validQuery(req, res, next) {
  const {date, mobile_number} = req.query

  if (!mobile_number) {
    dateValue = Date.parse(date)

    if (!date || !date.length) return next({status: 400, message: "Missing date value"})
    if (!dateValue) return next({status: 400, message: `Invalid date value: ${date}`})

    const data = await service.listByDate(date)
    if (!data || data.length === 0) return next({status: 404, message: "No valid reservations found"})

    res.locals.data = data
  }

  if (!date) {
    res.locals.data = await service.listByNumber(mobile_number)
  }

  return next()
}

async function reservationExists(req, res, next) {
  const {reservation_id} = req.params

  const data = await service.read(reservation_id)

  if (data[0] === undefined) return next({status: 404, message: `Reservation ${reservation_id} not found`})

  res.locals.data = data[0]
  res.locals.reservation_id = reservation_id

  return next()
}

function hasData(req, res, next) {
  const {data} = req.body

  if (!data) return next({status: 400, message: "Values should be in the 'data' section of the request body"})

  return next()
}


// this function checks to make sure all properties are valid before the create() function is run
function hasValidProperties(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status = "booked"
  } = req.body.data

  // must create a Date object to use Date functions, such as getTime() in the reservation_date if statement below
  const reservationDate = new Date(reservation_date)

  if (!first_name || first_name.length === 0) return next({status: 400, message: "Missing first_name attribute"})
  if (!last_name || last_name.length === 0) return next({status: 400, message: "Missing last_name attribute"})
  if (!mobile_number || mobile_number.length === 0) return next({status: 400, message: "Missing mobile_number attribute"})
  if (!reservation_date || reservation_date.length === 0 || !reservationDate.getTime()) return next({status: 400, message: "Missing or invalid reservation_date"})
  if (!reservation_time || reservation_time.length === 0 || !validTime(reservation_time)) return next({status: 400, message: "Missing or invalid reservation_time"})
  if (people === undefined || people <= 0 || !Number.isInteger(people)) return next({status: 400, message: "people must be a valid number and greater than 0"})
  if (req.method === "POST") {
    if (status === "seated" || status === "finished") return next({status: 400, message: `Can not create a new reservation with the status ${status}, status must be 'booked' or left out of the body`})
  }

  // set up our res.locals so we can just use input it in our create() function
  if (req.method === "POST") {
    res.locals = {
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
      status: status,
    }
  }

  if (req.method === "PUT" && req.path === `/${res.locals.reservation_id}`) {
    res.locals = {
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
      status: status,
      reservation_id: res.locals.data.reservation_id
    }
  }

  return next()
}

function notTuesday(req, res, next) {
  const {reservation_date} = res.locals

  // must pass reservation_date into the Date constructor so we can run getDay()
  // IMPORTANT SIDE NOTE: Tuesday should return 2 but for some reason it always returns expected_value - 1
  const resDay = new Date(reservation_date).getDay()

  if (resDay + 1 === 2) return next({status: 400, message: "Reservations can not be on Tuesdays. The restaurant is closed on Tuesdays"})

  return next()
}

function isValidDate(req, res, next) {
  const {reservation_date} = res.locals
  if (Date.parse(reservation_date) < Date.now()) return next({status: 400, message: "Reservation must be for a future date"})
  return next()
}

function isValidTime(req, res, next) {
  const {reservation_time, reservation_date} = res.locals

  // this line checks to make sure the restaurant is open for the reservation time
  // no need to use the date constructor for reservation_time, string comparisons works just fine 
  if (reservation_time < "10:30" || reservation_time > "21:30") return next({status: 400, message: "Reservation time must be after 10:30 AM and before 9:30 PM"})
  return next()
}

function validStatus(req, res, next) {
  let {status = "booked"} = req.body.data

  if (status !== "booked" && status !== "seated" && status !== "finished" && status !== "cancelled") return next({status: 400, message: `Given status unknown: ${status}; status must be 'booked', 'seated', 'finished', or 'cancelled'`})
  
  let {status: secondStatus} = res.locals.data

  if (secondStatus === "finished") return next({status: 400, message: "Reservation is already finished"})

  res.locals.status = status

  return next()
}

module.exports = {
  list: [asyncErrorBoundary(validQuery), list],
  read: [asyncErrorBoundary(reservationExists), read],
  create: [hasData, hasValidProperties, isValidDate, isValidTime, notTuesday, asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(reservationExists), hasData, validStatus, asyncErrorBoundary(update)],
  updateReservation: [asyncErrorBoundary(reservationExists), hasData, validStatus, hasValidProperties, asyncErrorBoundary(updateReservation)],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)]
};

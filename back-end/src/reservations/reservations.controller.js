// reservations controller file


// the service variable points to our reservations service file
const service = require("./reservations.service")
// validTime is a custom function that can be found in the /back-end/utils folder
const validTime = require("../utils/validTime");

// list function for the API
// the service function takes in a date to return specific days of reservations
async function read(req, res, next) {
  let {date} = req.query
  dateValue = Date.parse(date)

  if (!date || !date.length) return next({status: 400, message: "Missing date value"})
  if (!dateValue) return next({status: 400, message: `Invalid date value: ${date}`})

  const data = await service.read(date)
  if (!data || data.length === 0) return next({status: 404, message: "No valid reservations found"})

  res.json({data: await service.read(date)});  
}

// create function for the API
// res.locals stores all the data for the new reservation
async function create(req, res) {
  res.status(201).json({data: await service.insert(res.locals)})
}

// this function checks to make sure all properties are valid before the create() function is run
function hasValidProperties(req, res, next) {
  const {data} = req.body

  if (!data) return next({status: 400, message: "Values should be in the 'data' section of the request body"})
  
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people
  } = data

  // must create a Date object to use Date functions, such as getTime() in the reservation_date if statement below
  const reservationDate = new Date(reservation_date)

  if (!first_name || first_name.length === 0) return next({status: 400, message: "Missing first_name attribute"})
  if (!last_name || last_name.length === 0) return next({status: 400, message: "Missing last_name attribute"})
  if (!mobile_number || mobile_number.length === 0) return next({status: 400, message: "Missing mobile_number attribute"})
  if (!reservation_date || reservation_date.length === 0 || !reservationDate.getTime()) return next({status: 400, message: "Missing or invalid reservation_date"})
  if (!reservation_time || reservation_time.length === 0 || !validTime(reservation_time)) return next({status: 400, message: "Missing or invalid reservation_time"})
  if (people === undefined || people <= 0 || !Number.isInteger(people)) return next({status: 400, message: "people must be a valid number and greater than 0"})

  // set up our res.locals so we can just use input it in our create() function
  res.locals = {
    first_name: first_name,
    last_name: last_name,
    mobile_number: mobile_number,
    reservation_date: reservation_date,
    reservation_time: reservation_time,
    people: people
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

  // get todays date
  const today = Date.now()

  // turn reservation_date into an actual date using the Date() constructor
  const date = new Date(reservation_date)
  
  if (date < today) return next({status: 400, message: "Reservation date is set in the future"})

  return next()
}

async function isValidTime(req, res, next) {
  const {reservation_time} = res.locals
  // no need to use the date constructor for reservation_time, string comparisons works just fine 
  if (reservation_time < "10:30" || reservation_time > "21:30") return next({status: 400, message: "Reservation time must be after 10:30 AM and before 9:30 PM"})
  return next()
}

module.exports = {
  read,
  create: [hasValidProperties, isValidDate, isValidTime, notTuesday, create]
};

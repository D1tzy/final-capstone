const router = require("express").Router()
const controller = require("./tables.controller")
const methodNotAllowed = require("../utils/methodNotAllowed")

router.route("/:tableId").get(controller.read).all(methodNotAllowed)

module.exports = router
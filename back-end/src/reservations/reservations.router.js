/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../utils/methodNotAllowed")

router.route("/").get(controller.read).post(controller.create).all(methodNotAllowed);

module.exports = router;

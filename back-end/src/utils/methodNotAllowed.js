function methodNotAllowed(req, res, next) {
    next({status: 400, message: "Method not allowed"})
}

module.exports = methodNotAllowed
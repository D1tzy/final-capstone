const service = require("./tables.service")

function read(req, res, next) {
    try {
        const {tableId} = req.params
        res.json({data: service.read(tableId)})
    } catch {
        next({status: 400, message: "you fucked up"})
    }
}

module.exports = {
    read,
}
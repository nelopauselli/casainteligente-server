var express = require('express');

function Controllers(io, client) {
    var router = express.Router();

    router.use('/device', require("./device")(io));
    router.use('/datetime', require("./datetime"));
    router.use('/history', require("./history")(io, client));

    return router;
}

module.exports = Controllers;
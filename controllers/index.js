var express = require('express');

function Controllers(io) {
    var router = express.Router();

    router.use('/device', require("./device")(io));
    router.use('/datetime', require("./datetime"));
    router.use('/history', require("./history"));

    return router;
}

module.exports = Controllers;
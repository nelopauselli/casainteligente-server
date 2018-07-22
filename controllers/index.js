var express = require('express');
var router = express.Router();

router.use('/device', require("./device"))
router.use('/datetime', require("./datetime"))
router.use('/history', require("./history"))

module.exports = router;
var express = require('express');
var router = express.Router();

router.use('/room', require("./room"))
router.use('/device', require("./device"))
router.use('/datetime', require("./datetime"))

module.exports = router;
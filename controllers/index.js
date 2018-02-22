var express = require('express');
var router = express.Router();

router.use('/room', require("./room"))
router.use('/device', require("./device"))

module.exports = router;
var express = require('express');
var router = express.Router();

router.use('/room', require("./room"))

module.exports = router;